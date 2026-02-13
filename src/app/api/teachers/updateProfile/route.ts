// app/api/teachers/updateProfile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { TeacherEducation } from "@prisma/client"; // ✅ Enum type from Prisma

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

// ✅ Helper function to upload file to Cloudinary
async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url as string);
      }
    );
    stream.end(buffer);
  });
}

// ✅ Define types for cleaner data
type TeacherSubjectInput = {
  name: string;
  price: number;
};

export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // ✅ Extract User info
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string | null;

    // ✅ Extract TeacherProfile info
    const age = formData.get("age") ? Number(formData.get("age")) : null;
    const city = formData.get("city") as string | null;

    const educationValue = formData.get("education") as
      | keyof typeof TeacherEducation
      | null;

    const experienceYears = formData.get("experienceYears") as string | null;
    const preferredAgeGroups = JSON.parse(
      (formData.get("preferredAgeGroups") as string) || "[]"
    );
    const hasCertificate = formData.get("hasCertificate") === "true";
    const offersFreeIntroLesson =
      formData.get("offersFreeIntroLesson") === "true";
    const hasIntroVideo = formData.get("hasIntroVideo") === "true";
    const goal = formData.get("goal") as string | null;
    const howDidYouHearAboutUs = formData.get("howDidYouHearAboutUs") as
      | string
      | null;
    const certificateDescription = formData.get("certificateDescription") as
      | string
      | null;

    const teacherSubjects = JSON.parse(
      (formData.get("teacherSubjects") as string) || "[]"
    ) as TeacherSubjectInput[];

    const existingCertificateFiles = JSON.parse(
      (formData.get("existingCertificateFiles") as string) || "[]"
    ) as string[];

    const existingIntroVideoUrl = formData.get("existingIntroVideoUrl") as
      | string
      | null;

    // ✅ Upload certificate files
    const uploadedCertificateUrls: string[] = [...existingCertificateFiles];
    const certificateFiles = formData.getAll("certificateFiles") as File[];

    for (const file of certificateFiles) {
      const url = await uploadToCloudinary(
        file,
        `teachers/${userId}/certificates`,
        "image"
      );
      uploadedCertificateUrls.push(url);
    }

    // ✅ Upload intro video (if provided)
    let uploadedVideoUrl: string | null = existingIntroVideoUrl;
    const introVideo = formData.get("introVideo") as File | null;
    if (introVideo) {
      uploadedVideoUrl = await uploadToCloudinary(
        introVideo,
        `teachers/${userId}/videos`,
        "video"
      );
    }

    // ✅ Update User and TeacherProfile in Prisma (Neon)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        TeacherProfile: {
          upsert: {
            create: {
              age: age || undefined,
              city,
              education: educationValue
                ? (educationValue as TeacherEducation)
                : undefined,
              experienceYears,
              preferredAgeGroups,
              hasCertificate,
              offersFreeIntroLesson,
              hasIntroVideo,
              goal,
              howDidYouHearAboutUs,
              certificateDescription,
              certificateFiles: uploadedCertificateUrls,
              introVideoUrl: uploadedVideoUrl,
              teacherSubjects: {
                create: teacherSubjects.map((s) => ({
                  name: s.name,
                  price: s.price,
                })),
              },
            },
            update: {
              age: age || undefined,
              city,
              education: educationValue
                ? (educationValue as TeacherEducation)
                : undefined,
              experienceYears,
              preferredAgeGroups,
              hasCertificate,
              offersFreeIntroLesson,
              hasIntroVideo,
              goal,
              howDidYouHearAboutUs,
              certificateDescription,
              certificateFiles: uploadedCertificateUrls,
              introVideoUrl: uploadedVideoUrl,
              teacherSubjects: {
                deleteMany: {}, // Clear old subjects before adding new ones
                create: teacherSubjects.map((s) => ({
                  name: s.name,
                  price: s.price,
                })),
              },
            },
          },
        },
      },
      include: { TeacherProfile: true },
    });

    return NextResponse.json({
      success: true,
      uploadedCertificateUrls,
      uploadedVideoUrl,
      updatedUser,
    });
  } catch (error: unknown) {
    console.error("❌ Error updating teacher profile:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

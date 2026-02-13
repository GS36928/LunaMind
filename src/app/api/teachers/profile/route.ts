import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary კონფიგურაცია
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

interface Subject {
  name: string;
  price: number;
}

interface Base64File {
  name: string;
  type: string;
  size: number;
  base64: string;
}

interface PostBody {
  userId: string;
  step: number;
  isLastQuestion: boolean;
  answers: {
    [key: string]:
      | string
      | number
      | boolean
      | undefined
      | Subject[]
      | string[]
      | Base64File[];
  };
}

// Cloudinary ტიპები
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width?: number;
  height?: number;
  resource_type: string;
  bytes: number;
}

interface CloudinaryUploadError {
  message: string;
  http_code?: number;
}

// Base64 ფაილის ატვირთვის ფუნქცია Cloudinary-ზე
async function uploadBase64ToCloudinary(
  base64Data: string,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64Data,
      {
        folder: `teachers/${folder}`,
        resource_type: "auto",
      },
      (
        error: CloudinaryUploadError | undefined,
        result: CloudinaryUploadResult | undefined
      ) => {
        if (error) {
          console.error(`Cloudinary upload error for ${folder}:`, error);
          return reject(new Error(error.message));
        }
        if (result) {
          console.log(`✅ File uploaded to Cloudinary: ${result.secure_url}`);
          return resolve(result.secure_url);
        }
        reject(new Error("Upload failed without error"));
      }
    );
  });
}

// მრავალი Base64 ფაილის ატვირთვა
async function uploadMultipleBase64Files(
  files: Base64File[],
  folder: string
): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadBase64ToCloudinary(file.base64, folder)
  );
  return Promise.all(uploadPromises);
}

export async function POST(req: Request) {
  try {
    const body: PostBody = await req.json();
    const { userId, step, isLastQuestion, answers } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "UserId აუცილებელია" },
        { status: 400 }
      );
    }

    console.log("📥 Received data:", { userId, step, isLastQuestion, answers });

    // ✅ იპოვე ან შექმენი პროფილი
    let profile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await prisma.teacherProfile.create({
        data: { userId },
      });
    }

    // ✅ მოამზადე განახლების მონაცემები Prisma-ს ტიპებით
    const updateData: Parameters<
      typeof prisma.teacherProfile.update
    >[0]["data"] = {
      currentStep: step + 1,
    };

    // ✅ ცვლადები ატვირთული ფაილების URL-ების შესანახად
    let uploadedCertificateUrls: string[] = [];
    let uploadedVideoUrl: string | null = null;

    // ✅ დამუშავება თითოეული პასუხისთვის
    for (const [key, value] of Object.entries(answers)) {
      if (value === undefined || value === null) continue;

      console.log(`🔄 Processing field: ${key}`, value);

      switch (key) {
        case "subjects":
          // ✅ საგნების დამუშავება - მხოლოდ თუ არის ვალიდური საგნები
          if (Array.isArray(value)) {
            const subjects = value as Subject[];

            // ფილტრაცია - მხოლოდ ის საგნები რომელთაც აქვთ დადებითი ფასი
            const validSubjects = subjects.filter(
              (s) => s.price > 0 && s.name && s.name.trim() !== ""
            );

            if (validSubjects.length > 0) {
              // წაშალე ძველი საგნები და შექმენი ახლები
              await prisma.teacherSubject.deleteMany({
                where: { teacherId: profile.id },
              });

              const createSubjects = validSubjects.map((s) => ({
                teacherId: profile.id,
                name: s.name,
                price: s.price,
              }));

              await prisma.teacherSubject.createMany({
                data: createSubjects,
              });

              console.log(`✅ Saved ${validSubjects.length} subjects`);
            } else {
              console.log(`ℹ️ No valid subjects to save`);
            }
          }
          break;

        case "preferredAgeGroups":
          // ✅ მრავალარჩევანი სტრინგების მასივებისთვის
          if (Array.isArray(value)) {
            updateData.preferredAgeGroups = {
              set: value as string[],
            };
            console.log(`✅ Saved preferred age groups: ${value}`);
          }
          break;

        case "certificateFiles":
          // ✅ სერთიფიკატის ფაილების ატვირთვა Cloudinary-ზე
          if (Array.isArray(value) && value.length > 0) {
            try {
              // Check if it's Base64 files
              const firstItem = value[0];
              if (typeof firstItem === "object" && "base64" in firstItem) {
                const base64Files = value as Base64File[];
                console.log(
                  `📤 Uploading ${base64Files.length} certificate files to Cloudinary...`
                );
                const fileUrls = await uploadMultipleBase64Files(
                  base64Files,
                  "certificates"
                );

                // 🆕 FIX: Use direct array assignment for certificateFiles
                updateData.certificateFiles = fileUrls;
                uploadedCertificateUrls = fileUrls;
                console.log(`✅ UPLOADED CERTIFICATE URLS:`, fileUrls);
              } else {
                // Already URLs or other format
                console.log(
                  `❌ Certificate files are not Base64, they are:`,
                  typeof firstItem,
                  firstItem
                );
              }
            } catch (error) {
              console.error("❌ Certificate files upload failed:", error);
              return NextResponse.json(
                { error: "სერთიფიკატების ატვირთვა ვერ მოხერხდა" },
                { status: 500 }
              );
            }
          } else {
            console.log(`❌ Certificate files are empty or not array:`, value);
          }
          break;

        case "introVideoUrl":
          // ✅ ვიდეოს ატვირთვა Cloudinary-ზე
          if (Array.isArray(value) && value.length > 0) {
            try {
              const firstItem = value[0];

              if (typeof firstItem === "object" && "base64" in firstItem) {
                // Base64 file, need to upload
                const base64File = firstItem as Base64File;

                // Check file size (40MB max)
                if (base64File.size > 40 * 1024 * 1024) {
                  return NextResponse.json(
                    { error: "ვიდეოს ზომა არ უნდა აღემატებოდეს 40MB-ს" },
                    { status: 400 }
                  );
                }

                const videoUrl = await uploadBase64ToCloudinary(
                  base64File.base64,
                  "intro-videos"
                );
                updateData.introVideoUrl = videoUrl;
                uploadedVideoUrl = videoUrl; // 🆕 შეინახე ატვირთული URL
                console.log(`✅ Uploaded intro video: ${videoUrl}`);
              } else if (typeof firstItem === "string") {
                // Already uploaded URL
                updateData.introVideoUrl = firstItem;
                uploadedVideoUrl = firstItem; // 🆕 შეინახე არსებული URL
              }
            } catch (error) {
              console.error("❌ Intro video upload failed:", error);
              return NextResponse.json(
                { error: "ვიდეოს ატვირთვა ვერ მოხერხდა" },
                { status: 500 }
              );
            }
          } else if (Array.isArray(value) && value.length === 0) {
            updateData.introVideoUrl = null;
            uploadedVideoUrl = null; // 🆕 null მნიშვნელობა
          }
          break;

        case "hasCertificate":
          if (typeof value === "boolean") {
            updateData.hasCertificate = value;
            console.log(`✅ Saved hasCertificate: ${value}`);
          }
          break;

        case "offersFreeIntroLesson":
          if (typeof value === "boolean") {
            updateData.offersFreeIntroLesson = value;
            console.log(`✅ Saved offersFreeIntroLesson: ${value}`);
          }
          break;

        case "hasIntroVideo":
          if (typeof value === "boolean") {
            updateData.hasIntroVideo = value;
            console.log(`✅ Saved hasIntroVideo: ${value}`);
          }
          break;

        case "age":
          if (typeof value === "number") {
            updateData.age = value;
            console.log(`✅ Saved age: ${value}`);
          }
          break;

        case "education":
          if (typeof value === "string" && value.trim() !== "") {
            const educationValue = value.toUpperCase() as
              | "BACHELOR"
              | "MASTER"
              | "DOCTORATE"
              | "OTHER";
            if (
              ["BACHELOR", "MASTER", "DOCTORATE", "OTHER"].includes(
                educationValue
              )
            ) {
              updateData.education = educationValue;
            } else {
              updateData.education = "OTHER";
            }
            console.log(`✅ Saved education: ${updateData.education}`);
          }
          break;

        case "city":
          if (typeof value === "string" && value.trim() !== "") {
            updateData.city = value;
            console.log(`✅ Saved city: ${value}`);
          }
          break;

        case "profession":
          if (typeof value === "string" && value.trim() !== "") {
            updateData.profession = value;
            console.log(`✅ Saved profession: ${value}`);
          }
          break;

        case "goal":
          if (typeof value === "string" && value.trim() !== "") {
            updateData.goal = value;
            console.log(`✅ Saved goal: ${value}`);
          }
          break;

        case "experienceYears":
          if (typeof value === "string" && value.trim() !== "") {
            updateData.experienceYears = value;
            console.log(`✅ Saved experienceYears: ${value}`);
          }
          break;

        case "certificateDescription":
          if (typeof value === "string" && value.trim() !== "") {
            updateData.certificateDescription = value;
            console.log(`✅ Saved certificateDescription: ${value}`);
          }
          break;

        case "howDidYouHearAboutUs":
          if (typeof value === "string" && value.trim() !== "") {
            updateData.howDidYouHearAboutUs = value;
            console.log(`✅ Saved howDidYouHearAboutUs: ${value}`);
          }
          break;

        default:
          console.warn(`⚠️ Unknown field: ${key}`);
          break;
      }
    }

    // ✅ განაახლე პროფილი
    const updatedProfile = await prisma.teacherProfile.update({
      where: { userId },
      data: updateData,
    });

    console.log("✅ Profile updated successfully:", updatedProfile);

    // ✅ თუ ბოლო კითხვაა, მონიშნე როგორც დასრულებული
    if (isLastQuestion) {
      await prisma.teacherProfile.update({
        where: { userId },
        data: { completed: true },
      });
    }

    console.log("🎯 Final uploaded files before response:", {
      certificateFiles: uploadedCertificateUrls,
      introVideoUrl: uploadedVideoUrl,
      certificateFilesLength: uploadedCertificateUrls.length,
      certificateFilesFirst: uploadedCertificateUrls[0],
    });

    // 🆕 დააბრუნე ატვირთული ფაილების URL-ები
    return NextResponse.json({
      success: true,
      message: "პროფილი წარმატებით განახლდა",
      currentStep: step + 1,
      uploadedFiles: {
        certificateFiles: uploadedCertificateUrls,
        introVideoUrl: uploadedVideoUrl ? [uploadedVideoUrl] : [],
      },
    });
  } catch (err) {
    console.error("❌ TeacherProfile POST error:", err);
    return NextResponse.json({ error: "სერვერის შეცდომა" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "UserId აუცილებელია" },
        { status: 400 }
      );
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId },
      include: { teacherSubjects: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "პროფილი ვერ მოიძებნა" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("TeacherProfile GET error:", err);
    return NextResponse.json({ error: "სერვერის შეცდომა" }, { status: 500 });
  }
}

// app/api/teachers/deleteFile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto"; // ✅ ES Module import (instead of require)

export async function DELETE(req: NextRequest) {
  try {
    const { userId, fileUrl, fileType } = await req.json();

    if (!userId || !fileUrl || !fileType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("🗑️ Deleting file:", { userId, fileUrl, fileType });

    // ✅ Delete from Cloudinary
    try {
      const publicId = extractPublicIdFromUrl(fileUrl);
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (publicId && cloudName && apiKey && apiSecret) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = generateCloudinarySignature(
          publicId,
          apiSecret,
          timestamp
        );

        const params = new URLSearchParams({
          public_id: publicId,
          signature: signature,
          api_key: apiKey,
          timestamp: timestamp.toString(),
        });

        const resourceType = fileType === "video" ? "video" : "image";

        const destroyResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
          }
        );

        const destroyData = await destroyResponse.json();

        if (destroyData.result === "ok") {
          console.log(`✅ File deleted from Cloudinary: ${publicId}`);
        } else {
          console.error("❌ Cloudinary delete failed:", destroyData);
          // არ ვწყვეტთ პროცესს, თუნდაც Cloudinary-ზე წაშლა ვერ მოხერხდეს
        }
      }
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // არ ვწყვეტთ პროცესს, თუნდაც Cloudinary-ზე წაშლა ვერ მოხერხდეს
    }

    // ✅ Delete from database
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    if (fileType === "certificate") {
      const updatedCertificateFiles = (
        teacherProfile.certificateFiles || []
      ).filter((url: string) => url !== fileUrl);

      await prisma.teacherProfile.update({
        where: { id: teacherProfile.id },
        data: {
          certificateFiles: {
            set: updatedCertificateFiles,
          },
        },
      });

      console.log(
        "✅ Certificate deleted from database. Remaining:",
        updatedCertificateFiles.length
      );
    } else if (fileType === "video") {
      await prisma.teacherProfile.update({
        where: { id: teacherProfile.id },
        data: {
          introVideoUrl: null,
        },
      });
      console.log("✅ Video URL set to null in database");
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err: unknown) {
    console.error("❌ Failed to delete file:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to delete file: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// ✅ Helper function to extract public ID from Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove version number if present (e.g., /v1234567890/)
    const pathWithoutVersion = pathname.replace(/\/v\d+\//, "/");

    // Extract public ID - everything after upload/
    const uploadIndex = pathWithoutVersion.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const fullPath = pathWithoutVersion.substring(uploadIndex + 8); // +8 for '/upload/'
      const publicId = fullPath.replace(/\.[^/.]+$/, ""); // remove file extension
      return publicId;
    }
    return null;
  } catch {
    return null;
  }
}

// ✅ Helper function to generate Cloudinary signature
function generateCloudinarySignature(
  publicId: string,
  apiSecret: string,
  timestamp: number
): string {
  const params = `public_id=${publicId}&timestamp=${timestamp}`;
  return crypto
    .createHash("sha1")
    .update(params + apiSecret)
    .digest("hex");
}

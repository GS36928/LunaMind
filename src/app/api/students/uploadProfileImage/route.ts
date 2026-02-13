// src/app/api/students/uploadProfileImage/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs"; // 🟢 server-only

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

// TypeScript custom types for Cloudinary response
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  original_filename: string;
  [key: string]: unknown; // დამატებითი fields
}

interface CloudinaryUploadError {
  message: string;
  http_code?: number;
  [key: string]: unknown;
}

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    const userId = data.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "File or userId missing" },
        { status: 400 }
      );
    }

    // File -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ძველი სურათის მოძებნა
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    // ძველი სურათის წაშლა Cloudinary-ზე
    if (user?.image) {
      const publicId = user.image.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`students/${publicId}`);
      }
    }

    // ახალი სურათის ატვირთვა
    const uploaded: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "students" },
          (
            error: CloudinaryUploadError | undefined,
            result: CloudinaryUploadResult | undefined
          ) => {
            if (error) return reject(new Error(error.message));
            if (result) return resolve(result);
            reject(new Error("Upload failed without error"));
          }
        );
        stream.end(buffer);
      }
    );

    // Prisma განახლება
    await prisma.user.update({
      where: { id: userId },
      data: { image: uploaded.secure_url },
    });

    return NextResponse.json({ imageUrl: uploaded.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};

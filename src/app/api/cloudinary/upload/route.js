import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { applyRateLimit, uploadRateLimit, getUserIdFromRequest } from "@/lib/rateLimit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Apply rate limiting for uploads
    const userId = await getUserIdFromRequest(req);
    const rateLimitResult = await applyRateLimit(req, uploadRateLimit, userId);
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json(
        { success: false, message: "Too many upload requests. Please try again later." },
        { status: 429 }
      );
      
      // Add rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const folder = formData.get("folder") || "unkown";
    const public_id = formData.get("public_id") || "unkown";
    const overwrite = formData.get("overwrite") === "true";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Max 10MB only" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image uploads allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id,
          overwrite,
          folder,
          resource_type: "image"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const response = NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    // Add rate limit headers to successful response
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      { status: 500 }
    );
  }
}
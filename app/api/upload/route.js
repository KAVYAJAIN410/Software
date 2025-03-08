import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Material from "@/models/material.model";
import Users from "@/models/user.model";
import cloudinary from "@/lib/cloudinary"; // ✅ Correctly import Cloudinary
import path from "path";
import fs from "fs/promises";

export async function POST(req) {
  try {
    await dbConnect();

    // ✅ Parse FormData
    const formData = await req.formData();
    const file = formData.get("file");
    const Title = formData.get("Title");
    const Description = formData.get("Description");

    if (!file || !Title || !Description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    console.log("📝 Extracted Fields:", { Title, Description });
    console.log("✅ Uploaded File:", file.name);

    // ✅ Validate authentication
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const existingUser = await Users.findOne({ email: token });

    if (!existingUser || !existingUser.isTeacher) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // ✅ Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Upload to Cloudinary as a RAW file
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "uploads" }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    console.log("🌍 File uploaded to Cloudinary:", uploadResult.secure_url);

    // ✅ Save Material Info in DB
    const newMaterial = new Material({
      Title,
      Description,
      teacherId: existingUser._id,
      fileUrl: uploadResult.secure_url, // ✅ Save Cloudinary URL
      fileId: uploadResult.public_id, // 🔄 Store Cloudinary's public_id instead of file name
    });

    await newMaterial.save();

    return NextResponse.json({ success: true, message: "Material uploaded", fileUrl: uploadResult.secure_url }, { status: 201 });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



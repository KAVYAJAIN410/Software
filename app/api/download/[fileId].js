import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { file } = params;
    console.log("🛠 Requested File (Raw):", file);

    const decodedFileName = decodeURIComponent(file);
    console.log("🔍 Decoded File Name:", decodedFileName);

    const filePath = path.join(process.cwd(), "public/uploads", decodedFileName);
    console.log("📂 Full File Path:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("❌ File Not Found:", filePath);
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    console.log("✅ File Found! Sending Response...");
    return new NextResponse(fs.createReadStream(filePath), {
      headers: {
        "Content-Disposition": `attachment; filename="${decodedFileName}"`,
        "Content-Type": "application/pdf",
      },
    });

  } catch (error) {
    console.error("🔥 Download Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

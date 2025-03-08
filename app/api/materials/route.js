import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Material from "@/models/material.model.js";
import Users from "@/models/user.model";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ Extract & Verify Token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
   
    const token = authHeader.split(' ')[1]; // Extract token
    
    // ✅ Find Teacher
    const existingUser = await Users.findOne({ email: token });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 409 });
    }

    if (!existingUser.isTeacher) {
      return NextResponse.json({ message: "Not a teacher" }, { status: 403 });
    }

    // ✅ Fetch Materials Uploaded by This Teacher
    const materials = await Material.find({ teacherId: existingUser._id });

    return NextResponse.json({ success: true, materials }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

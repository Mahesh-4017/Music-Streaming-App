import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json(
        { message: "Database is not connected. Please add MONGODB_URI in Netlify Environment Variables." },
        { status: 503 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already in use." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashed });

    return NextResponse.json({ message: "Account created successfully." }, { status: 201 });
  } catch (err) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { message: "Unable to complete registration. Please check database connection or try Guest mode." },
      { status: 500 }
    );
  }
}
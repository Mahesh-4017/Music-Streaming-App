import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    console.log("hello gys");
    console.log(name, email, password );
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
      console.log("hello gys");
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already in use." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name, email, password: hashed });

    return NextResponse.json({ message: "Account created." }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
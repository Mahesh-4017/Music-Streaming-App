import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";

export async function GET() {
  try {
    await dbConnect();

    const songs = await Song.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: songs });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Playlist from "@/models/Playlist";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const playlist = await Playlist.findById(params.id)
      .populate("songs") // 🔥 IMPORTANT (fetch song data)
      .lean();

    if (!playlist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: playlist });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
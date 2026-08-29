import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Playlist from "@/models/Playlist";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const playlist = await Playlist.findById(id)
      .populate("songs")
      .lean();

    if (!playlist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: playlist });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "An unknown error occurred" },
      { status: 500 }
    );
  }
}
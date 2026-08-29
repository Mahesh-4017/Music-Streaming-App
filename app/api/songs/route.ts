import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch songs for logged-in user or public tracks
export async function GET(req: NextRequest) {
  try {
    const connPromise = dbConnect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB Timeout")), 1200)
    );
    await Promise.race([connPromise, timeoutPromise]);

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    let query: Record<string, unknown> = {};
    if (userEmail) {
      query = { $or: [{ uploaderEmail: userEmail }, { isPublic: true }] };
    }

    const songs = await Song.find(query).sort({ createdAt: -1 }).maxTimeMS(1200);
    return NextResponse.json({ success: true, data: songs });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST: Add new YouTube link or uploaded MP3 track to MongoDB Atlas
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { title, artist, audioUrl, thumbnailUrl, type, duration } = body;

    if (!audioUrl || !title) {
      return NextResponse.json(
        { success: false, message: "title and audioUrl are required" },
        { status: 400 }
      );
    }

    const newSong = await Song.create({
      title,
      artist: artist || "Unknown Artist",
      audioUrl,
      thumbnailUrl: thumbnailUrl || "/assets/images/default-song.png",
      type: type || (audioUrl.includes("youtube.com") || audioUrl.includes("youtu.be") ? "youtube" : "audio"),
      duration: duration || 0,
      uploaderEmail: session?.user?.email || "guest@musify.app",
      isPublic: true,
    });

    return NextResponse.json({ success: true, data: newSong });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove track by id
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Song ID required" },
        { status: 400 }
      );
    }

    const query: Record<string, unknown> = { _id: id };
    if (session?.user?.email) {
      query.uploaderEmail = session.user.email;
    }

    await Song.deleteOne(query);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
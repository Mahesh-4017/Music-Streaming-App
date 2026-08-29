import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const form = await req.formData();

    const audio     = form.get("audio")     as File;
    const thumbnail = form.get("thumbnail") as File | null;
    const title     = form.get("title")     as string;
    const artist    = form.get("artist")    as string;

    if (!audio || !title || !artist) {
      return NextResponse.json(
        { error: "audio, title, artist are required" },
        { status: 400 }
      );
    }

    // Save to /public/uploads/songs/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "songs");
    await mkdir(uploadDir, { recursive: true });

    const audioName = `${Date.now()}-${audio.name.replace(/\s+/g, "-")}`;
    const audioPath = path.join(uploadDir, audioName);
    await writeFile(audioPath, Buffer.from(await audio.arrayBuffer()));

    let thumbnailUrl = "/assets/images/default-song.png";
    if (thumbnail) {
      const thumbDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
      await mkdir(thumbDir, { recursive: true });
      const thumbName = `${Date.now()}-${thumbnail.name.replace(/\s+/g, "-")}`;
      await writeFile(path.join(thumbDir, thumbName), Buffer.from(await thumbnail.arrayBuffer()));
      thumbnailUrl = `/uploads/thumbnails/${thumbName}`;
    }

    await dbConnect();

    const newSong = await Song.create({
      title,
      artist,
      audioUrl: `/uploads/songs/${audioName}`,
      thumbnailUrl: thumbnailUrl,
      type: "audio",
      uploaderEmail: session?.user?.email || "guest@musify.app",
      isPublic: true,
    });

    return NextResponse.json({ success: true, status: true, data: newSong });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
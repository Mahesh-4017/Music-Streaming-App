// ════════════════════════════════════════════════════════════════
//  HOW TO ADD YOUR OWN SONGS — FULL BACKEND GUIDE
//
//  Stack used: Next.js API routes + your own storage
//  Two options below — pick ONE based on your setup:
//    A) Local filesystem (dev only)
//    B) Cloudinary (recommended for production)
// ════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────
// OPTION A: Upload to LOCAL filesystem (dev only)
// File: app/api/songs/upload/route.ts
// ─────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import path from "path";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
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

  // Validate audio type
  const ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/flac"];
  if (!ALLOWED_AUDIO.includes(audio.type)) {
    return NextResponse.json({ error: "Unsupported audio format" }, { status: 400 });
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

  // ✅ audioUrl is now a real playable URL
  const song = {
    id:          Date.now().toString(),
    title,
    artist,
    audioUrl:    `/uploads/songs/${audioName}`,   // ← THIS is what playerStore needs
    thumbnailUrl:   thumbnailUrl,
    duration:    0,   // TODO: parse with music-metadata package
    createdAt:   new Date().toISOString(),
  };

  await dbConnect();

const newSong = await Song.create({
  title,
  artist,
  audioUrl: `/uploads/songs/${audioName}`,
  thumbnailUrl: thumbnailUrl,
  uploader: new mongoose.Types.ObjectId("123456789012345678901234")
});

  return NextResponse.json({ status: true, data: song });
}


// ─────────────────────────────────────────────────────────────────
// OPTION B: Upload to CLOUDINARY (recommended for production)
// File: app/api/songs/upload/route.ts
// npm install cloudinary
// ─────────────────────────────────────────────────────────────────

/*
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const audio     = form.get("audio")     as File;
  const thumbnail = form.get("thumbnail") as File | null;
  const title     = form.get("title")     as string;
  const artist    = form.get("artist")    as string;

  if (!audio || !title || !artist) {
    return NextResponse.json({ error: "audio, title, artist are required" }, { status: 400 });
  }

  // Upload audio to Cloudinary
  const audioBuffer = Buffer.from(await audio.arrayBuffer());
  const audioUpload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "musify/songs" },   // "video" handles audio
      (err, result) => err ? reject(err) : resolve(result)
    ).end(audioBuffer);
  });

  let thumbnailUrl = "https://via.placeholder.com/300";
  if (thumbnail) {
    const thumbBuffer = Buffer.from(await thumbnail.arrayBuffer());
    const thumbUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "musify/thumbnails" },
        (err, result) => err ? reject(err) : resolve(result)
      ).end(thumbBuffer);
    });
    thumbnailUrl = thumbUpload.secure_url;
  }

  const song = {
    id:        Date.now().toString(),
    title,
    artist,
    audioUrl:  audioUpload.secure_url,   // ← real Cloudinary URL
    thumbnail: thumbnailUrl,
    duration:  Math.round(audioUpload.duration ?? 0),
    createdAt: new Date().toISOString(),
  };

  // TODO: save song to your DB

  return NextResponse.json({ status: true, data: song });
}
*/
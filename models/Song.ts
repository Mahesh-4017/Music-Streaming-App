import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;       // seconds
  audioUrl: string;        // MP3 URL or YouTube link
  thumbnailUrl?: string;
  uploaderEmail?: string;  // User's Gmail / email identifier
  uploader?: mongoose.Types.ObjectId;
  type?: "youtube" | "audio" | "video";
  plays?: number;
  likes?: number;
  isPublic?: boolean;
  createdAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title:         { type: String, required: true, trim: true },
    artist:        { type: String, required: true, trim: true, default: "Unknown Artist" },
    album:         { type: String, trim: true },
    genre:         { type: String, trim: true },
    duration:      { type: Number, default: 0 },
    audioUrl:      { type: String, required: true },
    thumbnailUrl:  { type: String },
    uploaderEmail: { type: String, index: true },
    uploader:      { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
    type:          { type: String, default: "youtube" },
    plays:         { type: Number, default: 0 },
    likes:         { type: Number, default: 0 },
    isPublic:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Clear cached model to ensure schema updates apply in dev hot-reloading
if (mongoose.models && mongoose.models.Song) {
  delete (mongoose.models as Record<string, unknown>).Song;
}

const Song: Model<ISong> = mongoose.model<ISong>("Song", SongSchema);

export default Song;
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;      // seconds
  audioUrl: string;       // path or cloud URL
  thumbnailUrl?: string;
  uploader: mongoose.Types.ObjectId;
  plays: number;
  likes: number;
  isPublic: boolean;
  createdAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title:        { type: String, required: true, trim: true },
    artist:       { type: String, required: true, trim: true },
    album:        { type: String, trim: true },
    genre:        { type: String, trim: true },
    duration:     { type: Number },
    audioUrl:     { type: String, required: true },
    thumbnailUrl: { type: String },
    uploader:     { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    plays:        { type: Number, default: 0 },
    likes:        { type: Number, default: 0 },
    isPublic:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Song: Model<ISong> =
  mongoose.models.Song ?? mongoose.model<ISong>("Song", SongSchema);

  
export default Song;
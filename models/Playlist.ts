import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlaylist extends Document {
  title: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    title: { type: String, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Playlist ||
  mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
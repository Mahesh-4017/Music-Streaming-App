import type { Metadata } from "next";
import PlaylistClient from "../PlaylistClient";

export const metadata: Metadata = {
  title: "Playlists · Musify",
  description: "Your saved YouTube Music and MP3 playlist",
};

export default function PlaylistPage() {
  return <PlaylistClient />;
}
// store/folderStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track } from "./playerStore";

export interface MusicFolder {
  id: string;
  name: string;
  description: string;
  coverBg: string; // Gradient class or color
  tracks: Track[];
  createdAt: string;
}

interface FolderState {
  folders: MusicFolder[];
  createFolder: (name: string, description?: string, coverBg?: string) => MusicFolder;
  deleteFolder: (folderId: string) => void;
  addTrackToFolder: (folderId: string, track: Track) => void;
  removeTrackFromFolder: (folderId: string, trackId: string) => void;
  isTrackInFolder: (folderId: string, trackId: string) => boolean;
}

const DEFAULT_FOLDERS: MusicFolder[] = [
  {
    id: "folder_chill",
    name: "Chill Vibes",
    description: "Relaxing melodies and acoustic sessions for study and focus.",
    coverBg: "from-blue-600 to-indigo-900",
    tracks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "folder_workout",
    name: "Workout Hits",
    description: "High energy beats and motivational tracks for intense workout sessions.",
    coverBg: "from-amber-500 to-red-700",
    tracks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "folder_favorites",
    name: "Night Grooves",
    description: "Late night synthwave, electronic and lo-fi jams.",
    coverBg: "from-purple-600 to-pink-800",
    tracks: [],
    createdAt: new Date().toISOString(),
  },
];

export const useFolderStore = create<FolderState>()(
  persist(
    (set, get) => ({
      folders: DEFAULT_FOLDERS,

      createFolder: (name: string, description = "", coverBg = "from-violet-600 to-indigo-900") => {
        const newFolder: MusicFolder = {
          id: `folder_${Date.now()}`,
          name: name.trim() || "New Folder",
          description: description.trim() || "Custom user music list",
          coverBg,
          tracks: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          folders: [newFolder, ...state.folders],
        }));

        return newFolder;
      },

      deleteFolder: (folderId: string) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== folderId),
        }));
      },

      addTrackToFolder: (folderId: string, track: Track) => {
        if (!track || !track.id) return;
        set((state) => ({
          folders: state.folders.map((folder) => {
            if (folder.id === folderId) {
              const exists = folder.tracks.some((t) => t.id === track.id);
              if (exists) return folder;
              return { ...folder, tracks: [track, ...folder.tracks] };
            }
            return folder;
          }),
        }));
      },

      removeTrackFromFolder: (folderId: string, trackId: string) => {
        set((state) => ({
          folders: state.folders.map((folder) => {
            if (folder.id === folderId) {
              return {
                ...folder,
                tracks: folder.tracks.filter((t) => t.id !== trackId),
              };
            }
            return folder;
          }),
        }));
      },

      isTrackInFolder: (folderId: string, trackId: string) => {
        const folder = get().folders.find((f) => f.id === folderId);
        if (!folder) return false;
        return folder.tracks.some((t) => t.id === trackId);
      },
    }),
    {
      name: "musify_music_folders",
    }
  )
);

// // components/layout/MobilePlayer.tsx
// "use client";

// import Image from "next/image";
// import Link  from "next/link";
// import { Play, Pause, SkipForward, Heart } from "lucide-react";
// import { usePlayerStore } from "@/store/playerStore";

// export default function MobilePlayer() {
//   const {
//     currentSong,
//     isPlaying,
//     progress,
//     togglePlay,
//     next,
//   } = usePlayerStore();

//   // Don't render if nothing is loaded
//   if (!currentSong) return null;

//   return (
//     /*
//      *  Sits just ABOVE the mobile nav bar.
//      *  bottom = var(--nav-height-mobile) = 64px
//      */
//     <div
//       className="
//         lg:hidden
//         fixed left-3 right-3
//         z-[calc(var(--z-player)-1)]
//         animate-fade-in
//       "
//       style={{ bottom: "calc(var(--nav-height-mobile) + 8px)" }}
//     >
//       <div
//         className="
//           relative overflow-hidden
//           bg-[var(--bg-elevated)]
//           border border-[var(--border)]
//           rounded-[var(--radius-xl)]
//           shadow-[var(--shadow-lg)]
//         "
//       >
//         {/* Progress bar — sits flush at the top of the card */}
//         <div className="h-0.5 bg-[var(--bg-surface)] w-full">
//           <div
//             className="h-full bg-[var(--brand)] transition-all duration-1000"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         {/* Main row */}
//         <div className="flex items-center gap-3 px-3 py-2.5">

//           {/* Thumbnail — tapping opens full player */}
//           <Link href="/player" className="flex-shrink-0">
//             <div className="w-10 h-10 rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-surface)]">
//               <Image
//                 src={currentSong.thumbnail}
//                 alt={currentSong.title}
//                 width={40}
//                 height={40}
//                 className="object-cover w-full h-full"
//               />
//             </div>
//           </Link>

//           {/* Song info — tapping opens full player */}
//           <Link href="/player" className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight">
//               {currentSong.title}
//             </p>
//             <p className="text-xs text-[var(--text-muted)] truncate leading-tight mt-0.5">
//               {currentSong.artist}
//             </p>
//           </Link>

//           {/* Controls */}
//           <div
//             className="flex items-center gap-1 flex-shrink-0"
//             // Prevent Link navigation when tapping controls
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Like */}
//             <button
//               className="
//                 btn-icon w-8 h-8 border-none
//                 text-[var(--text-muted)]
//                 hover:text-red-400 active:scale-90
//               "
//               aria-label="Like"
//             >
//               <Heart size={16} />
//             </button>

//             {/* Play / Pause */}
//             <button
//               onClick={togglePlay}
//               className="
//                 w-9 h-9 rounded-full
//                 bg-[var(--brand)] text-white
//                 flex items-center justify-center
//                 hover:bg-[var(--brand-dark)]
//                 active:scale-90
//                 transition-all
//                 shadow-[var(--shadow-brand)]
//                 flex-shrink-0
//               "
//               aria-label={isPlaying ? "Pause" : "Play"}
//             >
//               {isPlaying
//                 ? <Pause  size={15} strokeWidth={2.5} />
//                 : <Play   size={15} strokeWidth={2.5} />
//               }
//             </button>

//             {/* Skip */}
//             <button
//               onClick={next}
//               className="
//                 btn-icon w-8 h-8 border-none
//                 text-[var(--text-muted)]
//                 hover:text-[var(--text-primary)]
//                 active:scale-90
//               "
//               aria-label="Next track"
//             >
//               <SkipForward size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
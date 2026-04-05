// components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Heart, User } from "lucide-react";

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS = [
  { href: "/",            icon: Home,    label: "Home"    },
  { href: "/search",      icon: Search,  label: "Search"  },
  { href: "/library",     icon: Library, label: "Library" },
  { href: "/liked-songs", icon: Heart,   label: "Liked"   },
  { href: "/profile",     icon: User,    label: "Profile" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        lg:hidden
        fixed bottom-0 left-0 right-0
        z-[var(--z-player)]
        bg-[var(--bg-surface)]/95
        backdrop-blur-xl
        border-t border-[var(--border)]
        pb-safe
      "
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {TABS.map(({ href, icon: Icon, label }) => {
          // Match exact for home, prefix for others
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className="
                flex flex-col items-center gap-1
                min-w-[52px] py-1 px-2
                rounded-[var(--radius-md)]
                transition-all duration-[var(--duration-fast)]
                active:scale-95
              "
            >
              {/* Icon with active indicator dot */}
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  className={`
                    transition-colors duration-[var(--duration-fast)]
                    ${isActive
                      ? "text-[var(--brand)]"
                      : "text-[var(--text-muted)]"
                    }
                  `}
                />
                {/* Active dot */}
                {isActive && (
                  <span
                    className="
                      absolute -bottom-1 left-1/2 -translate-x-1/2
                      w-1 h-1 rounded-full bg-[var(--brand)]
                    "
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  text-[10px] font-medium leading-none
                  transition-colors duration-[var(--duration-fast)]
                  ${isActive
                    ? "text-[var(--brand)]"
                    : "text-[var(--text-muted)]"
                  }
                `}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
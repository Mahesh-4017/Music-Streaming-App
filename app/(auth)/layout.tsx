// app/(auth)/layout.tsx
// Auth pages intentionally have NO sidebar/navbar — clean, focused UI.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
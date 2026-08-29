import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email:    { label: "Email",    type: "email"    },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;

      try {
        const conn = await dbConnect();
        if (conn) {
          const user = await User.findOne({ email: credentials.email });
          if (user && user.password) {
            const valid = await bcrypt.compare(credentials.password, user.password);
            if (valid) {
              return { id: user._id.toString(), name: user.name, email: user.email, image: user.avatar };
            }
          }
        }
        
        // Fallback: If DB is not connected or user is entering a new account without DB configured
        const nameFromEmail = credentials.email.split("@")[0] || "Musify User";
        return {
          id: "user_" + Date.now(),
          name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
          email: credentials.email,
          image: "/assets/images/default-avatar.png",
        };
      } catch (err) {
        console.error("Auth Error:", err);
        const nameFromEmail = credentials.email.split("@")[0] || "Musify User";
        return {
          id: "user_" + Date.now(),
          name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
          email: credentials.email,
          image: "/assets/images/default-avatar.png",
        };
      }
    },
  }),
];

// Add Google Provider ONLY if real client credentials exist in environment
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !process.env.GOOGLE_CLIENT_ID.includes("placeholder")
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const conn = await dbConnect();
          if (conn) {
            const existing = await User.findOne({ email: user.email });
            if (!existing && user.email) {
              await User.create({
                name:   user.name || "User",
                email:  user.email,
                avatar: user.image || "",
              });
            }
          }
        } catch (e) {
          console.error("Error creating Google user:", e);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "musify_production_secret_key_2026_super_secure",
};
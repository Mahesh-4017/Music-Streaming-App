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
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.avatar };
      } catch (err) {
        console.error("Auth DB Error:", err);
        return null;
      }
    },
  }),
];

// Add Google Provider if credentials are set in environment
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
} else {
  // Safe fallback to prevent NextAuth runtime initialization crash
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google_client_id_placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google_client_secret_placeholder",
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
          await dbConnect();
          const existing = await User.findOne({ email: user.email });
          if (!existing && user.email) {
            await User.create({
              name:   user.name || "User",
              email:  user.email,
              avatar: user.image || "",
            });
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
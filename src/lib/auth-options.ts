import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        console.error("No email provided");
        return false;
      }

      try {
        // Connect to database
        await dbConnect();

        // Try to find existing user
        let dbUser = await User.findOne({ email: user.email });

        // If user doesn't exist, create new user
        if (!dbUser) {
          console.log("Creating new user:", user.email);
          try {
            dbUser = await User.create({
              username:
                user.name?.replace(/\s+/g, "").toLowerCase() ||
                user.email.split("@")[0],
              name: user.name || user.email.split("@")[0],
              email: user.email,
              image: user.image || "",
              isOAuthUser: true,
              [account?.provider + "Id"]: user.id,
            });
            console.log("User created successfully:", dbUser.email);
          } catch (error) {
            console.error("Error creating user:", error);
            // If username already exists, try with a random suffix
            if (
              error instanceof Error &&
              "code" in error &&
              error.code === 11000
            ) {
              const randomSuffix = Math.random().toString(36).substring(7);
              dbUser = await User.create({
                username: `${
                  user.name?.replace(/\s+/g, "").toLowerCase() ||
                  user.email.split("@")[0]
                }_${randomSuffix}`,
                name: user.name || user.email.split("@")[0],
                email: user.email,
                image: user.image || "",
                isOAuthUser: true,
                [account?.provider + "Id"]: user.id,
              });
              console.log("User created with random suffix:", dbUser.email);
            } else {
              throw error;
            }
          }
        } else {
          console.log("Existing user found:", dbUser.email);
        }

        return true;
      } catch (error) {
        console.error("Fatal database error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Get the base URL from environment variable or use baseUrl
      const siteUrl = process.env.NEXTAUTH_URL || baseUrl;

      // After successful sign in, always redirect to dashboard
      if (url.includes("/api/auth/callback")) {
        return `${siteUrl}/dashboard`;
      }

      // For sign in page, keep as is
      if (url === siteUrl) {
        return url;
      }

      // For all other cases, redirect to the requested URL
      return url.startsWith(siteUrl) ? url : siteUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
};

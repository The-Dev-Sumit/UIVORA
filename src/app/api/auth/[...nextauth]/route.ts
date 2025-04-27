import NextAuth, {
  DefaultSession,
  NextAuthOptions,
  AuthOptions,
  Session,
  User as NextAuthUser,
} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { JWT } from "next-auth/jwt";
import { authOptions } from "@/lib/auth-options";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

interface Credentials {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

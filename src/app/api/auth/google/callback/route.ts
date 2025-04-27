import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import axios from "axios";

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    // Log environment variables and request details
    console.log("Env Vars:", {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    });
    console.log("Request URL:", request.url);

    // Exchange code for tokens
    const tokenResponse = await axios.post<GoogleTokenResponse>(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get<GoogleUserInfo>(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { id: googleId, email, name } = userResponse.data;

    // Find or create user
    const user = await User.findOneAndUpdate(
      { $or: [{ googleId }, { email }] },
      {
        $setOnInsert: {
          username: name || email.split("@")[0],
          email,
          password: "",
          isOAuthUser: true,
        },
        $set: { googleId },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const dashboardUrl = new URL("/dashboard", baseUrl);
    console.log("Redirecting to:", dashboardUrl.toString());

    const response = NextResponse.redirect(dashboardUrl);
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("OAuth callback error:", error); // Share this output
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const signinUrl = new URL("/sign-in", baseUrl);
    signinUrl.searchParams.set("error", "auth_failed");
    console.log("Redirecting to error page:", signinUrl.toString());
    return NextResponse.redirect(signinUrl);
  }
}

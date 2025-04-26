import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import axios from "axios";

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUserInfo {
  id: string;
  login: string;
  email?: string;
  name?: string;
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

    console.log("Env Vars:", {
      GITHUB_ID: process.env.GITHUB_ID,
      GITHUB_SECRET: process.env.GITHUB_SECRET,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    });
    console.log("Request URL:", request.url);

    // Exchange code for tokens
    const tokenResponse = await axios.post<GitHubTokenResponse>(
      "https://github.com/login/oauth/access_token",
      {
        code,
        client_id: process.env.GITHUB_ID as string,
        client_secret: process.env.GITHUB_SECRET as string,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get<GitHubUserInfo>(
      "https://api.github.com/user",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { id: githubId, login, email, name } = userResponse.data;

    const user = await User.findOneAndUpdate(
      { $or: [{ githubId }, { email }] },
      {
        $setOnInsert: {
          username: name || login,
          email: email || `${login}@github.com`, // Fallback email if not provided
          password: "",
          isOAuthUser: true,
        },
        $set: { githubId },
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
    console.error("GitHub callback error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const signinUrl = new URL("/sign-in", baseUrl);
    signinUrl.searchParams.set("error", "auth_failed");
    console.log("Redirecting to error page:", signinUrl.toString());
    return NextResponse.redirect(signinUrl);
  }
}

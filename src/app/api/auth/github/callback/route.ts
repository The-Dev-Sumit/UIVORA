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

interface ErrorWithResponse extends Error {
  response?: {
    data?: any;
  };
}

export async function GET(request: Request) {
  try {
    console.log("1. Starting GitHub callback process");
    await dbConnect();
    console.log("2. Database connected");

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    console.log("3. Auth code received:", code ? "Yes" : "No");

    if (!code) {
      console.error("No code found in request");
      return NextResponse.json(
        { error: "Authorization code missing" },
        { status: 400 }
      );
    }

    // Log all environment variables (but mask sensitive data)
    console.log("4. Environment check:", {
      GITHUB_ID: process.env.GITHUB_ID ? "Set" : "Missing",
      GITHUB_SECRET: process.env.GITHUB_SECRET ? "Set" : "Missing",
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Missing",
    });

    // Exchange code for tokens
    console.log("5. Attempting to exchange code for token");
    let tokenResponse;
    try {
      tokenResponse = await axios.post<GitHubTokenResponse>(
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
      console.log(
        "6. Token response received:",
        tokenResponse.data.access_token ? "Success" : "Failed"
      );
    } catch (err) {
      const tokenError = err as ErrorWithResponse;
      console.error(
        "Token exchange error:",
        tokenError.response?.data || tokenError.message
      );
      throw tokenError;
    }

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
          email: email || `${login}@github.com`,
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
  } catch (err) {
    const error = err as ErrorWithResponse;
    console.error("Detailed error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const signinUrl = new URL("/sign-in", baseUrl);
    signinUrl.searchParams.set("error", "auth_failed");
    signinUrl.searchParams.set("details", error.message);
    console.log("Redirecting to error page:", signinUrl.toString());
    return NextResponse.redirect(signinUrl);
  }
}

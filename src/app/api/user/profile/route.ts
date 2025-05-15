import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import User from "@/models/User";
import UserProfile from "@/models/UserProfile";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user data
    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) {
      userProfile = await UserProfile.create({
        userId: user._id,
        bio: "",
        avatar: "",
        socialLinks: [],
        skills: [],
      });
    }

    return NextResponse.json({
      username: user.username,
      email: user.email,
      bio: userProfile.bio || "",
      avatar: userProfile.avatar || "",
      skills: userProfile.skills || [],
      socialLinks: Array.isArray(userProfile.socialLinks)
        ? userProfile.socialLinks
        : [],
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    console.log("Received data:", data);

    // Validate required fields
    if (!data.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      await dbConnect();
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Get user data
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update username if provided
    if (data.username) {
      user.username = data.username;
      await user.save();
    }

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) {
      userProfile = new UserProfile({
        userId: user._id,
        bio: "",
        avatar: "",
        socialLinks: [],
        skills: [],
      });
    }

    // Validate social links
    if (Array.isArray(data.socialLinks)) {
      for (const link of data.socialLinks) {
        if (!link.platform || !link.url) {
          return NextResponse.json(
            { error: "Invalid social link format" },
            { status: 400 }
          );
        }
        try {
          new URL(link.url);
        } catch (e) {
          return NextResponse.json(
            { error: `Invalid URL in social link: ${link.url}` },
            { status: 400 }
          );
        }
      }
    }

    // Update profile data
    const profileData = {
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(Array.isArray(data.socialLinks) && { socialLinks: data.socialLinks }),
      ...(Array.isArray(data.skills) && { skills: data.skills }),
    };

    console.log("Profile data to save:", profileData);

    // Update and save profile
    Object.assign(userProfile, profileData);

    try {
      const savedProfile = await userProfile.save();
      console.log("Saved profile:", savedProfile);

      // Return combined response
      return NextResponse.json({
        username: user.username,
        email: user.email,
        bio: savedProfile.bio || "",
        avatar: savedProfile.avatar || "",
        skills: savedProfile.skills || [],
        socialLinks: Array.isArray(savedProfile.socialLinks)
          ? savedProfile.socialLinks
          : [],
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      if (error.name === "ValidationError") {
        return NextResponse.json(
          {
            error: "Invalid data provided",
            details: error.message,
            validationErrors: Object.values(error.errors).map(
              (err: any) => err.message
            ),
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error updating profile:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}

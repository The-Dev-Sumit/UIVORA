import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import UserProfile from "@/models/UserProfile";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await dbConnect();

    // Username se user ko dhundho
    const user = await User.findOne({ username: params.username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user profile
    const userProfile = await UserProfile.findOne({ userId: user._id });
    if (!userProfile) {
      return NextResponse.json({
        username: user.username,
        bio: "",
        avatar: "",
        skills: [],
        socialLinks: [],
      });
    }

    // Return public profile data
    return NextResponse.json({
      username: user.username,
      email: user.email,
      bio: userProfile.bio || "",
      avatar: userProfile.avatar || "",
      skills: userProfile.skills || [],
      socialLinks: userProfile.socialLinks || [],
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

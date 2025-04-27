import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { dbConnect } from "@/lib/mongodb";
import { Component } from "@/models/Component";
import User from "@/models/User";

// API route for handling component operations
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await dbConnect();

    // Get user data first
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const component = await Component.create({
      ...data,
      userId: user._id, // Use MongoDB ObjectId
      username: user.username, // Get username from user document
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Component saved", component });
  } catch (error) {
    console.error("Error saving component:", error);
    return NextResponse.json(
      { error: "Failed to save component" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await dbConnect();

    if (id) {
      const component = await Component.findById(id).populate(
        "userId",
        "username"
      );
      if (!component) {
        return NextResponse.json(
          { error: "Component not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(component);
    }

    // Return all public components if no ID is provided
    const components = await Component.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .exec();
    return NextResponse.json(components || []);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}

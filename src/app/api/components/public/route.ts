import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    // Get all components with user data
    const components = await db
      .collection("components")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "email",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            type: 1,
            code: 1,
            createdAt: 1,
            updatedAt: 1,
            userId: 1,
            metadata: 1,
            username: { $ifNull: ["$user.username", "Unknown User"] },
            userImage: { $ifNull: ["$user.image", ""] },
            userName: { $ifNull: ["$user.name", ""] },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray();

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching public components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}

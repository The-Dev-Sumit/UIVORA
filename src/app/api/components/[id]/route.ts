import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    const params = await context.params;

    // Convert string ID to ObjectId
    const objectId = new mongoose.Types.ObjectId(params.id);

    // Get component with user data using aggregation
    const components = await db
      .collection("components")
      .aggregate([
        {
          $match: { _id: objectId },
        },
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
      ])
      .toArray();

    if (!components || components.length === 0) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(components[0]);
  } catch (error) {
    console.error("Error fetching component:", error);
    return NextResponse.json(
      { error: "Failed to fetch component" },
      { status: 500 }
    );
  }
}

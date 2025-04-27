import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Component from "@/models/Component";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { ComponentTag } from "@/components/TagSelectionModal";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    const components = await db
      .collection("components")
      .find({ userId: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, code, metadata } = body;
    const tag = metadata?.tag || "all";

    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db.collection("components").insertOne({
      userId: session.user.email,
      name,
      type,
      code,
      metadata,
      tag,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId });
  } catch (error) {
    console.error("Error saving component:", error);
    return NextResponse.json(
      { error: "Failed to save component" },
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Component ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { code, metadata } = body;
    const tag = metadata?.tag || "all";

    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db.collection("components").updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.email,
      },
      {
        $set: {
          code,
          metadata,
          tag,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating component:", error);
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Component ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db.collection("components").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.email,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Component not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting component:", error);
    return NextResponse.json(
      { error: "Failed to delete component" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Component from "@/models/Component";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const components = await Component.find({
      userId: session.user?.email,
    }).sort({ createdAt: -1 });
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
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const component = await Component.create({
      ...body,
      userId: session.user?.email,
    });
    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error("Error saving component:", error);
    return NextResponse.json(
      { error: "Failed to save component" },
      { status: 500 }
    );
  }
}

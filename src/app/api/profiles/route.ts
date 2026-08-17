import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, emoji, ageTier } = body;

    if (!name || !emoji || !ageTier) {
      return NextResponse.json(
        { error: "name, emoji, and ageTier are required" },
        { status: 400 }
      );
    }

    if (!["kid", "teen", "adult"].includes(ageTier)) {
      return NextResponse.json(
        { error: "ageTier must be kid, teen, or adult" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: { name, emoji, ageTier },
    });
    return NextResponse.json(profile, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.profile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}

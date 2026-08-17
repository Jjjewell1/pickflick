import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nightId, nominationId, profileId } = body;

    const existing = await prisma.vote.findUnique({
      where: {
        profileId_nominationId: {
          profileId,
          nominationId,
        },
      },
    });

    if (existing) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return NextResponse.json({ voted: false });
    }

    await prisma.vote.create({
      data: { nightId, nominationId, profileId },
    });
    return NextResponse.json({ voted: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nightId = searchParams.get("nightId");

    if (!nightId) {
      return NextResponse.json({ error: "nightId is required" }, { status: 400 });
    }

    const votes = await prisma.vote.findMany({
      where: { nightId },
    });
    return NextResponse.json(votes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}

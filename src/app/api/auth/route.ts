import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, pin } = body;

    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.pin && profile.pin !== pin) {
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 });
    }

    const safe = { ...profile };
    delete (safe as Record<string, unknown>).pin;
    return NextResponse.json({ profile: safe });
  } catch {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

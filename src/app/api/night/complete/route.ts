import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nightId, winnerTitle, winnerPoster } = body;

    const night = await prisma.movieNight.update({
      where: { id: nightId },
      data: {
        completed: true,
        winnerTitle,
        winnerPoster,
      },
    });

    return NextResponse.json(night);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

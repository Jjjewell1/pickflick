import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { genre, maxRating, participants, nominations } = body;

    const night = await prisma.movieNight.create({
      data: {
        genre,
        maxRating: maxRating || "",
        completed: false,
      },
    });

    for (const profileId of participants) {
      const nom = nominations?.find(
        (n: { profileId: string }) => n.profileId === profileId
      );
      if (nom) {
        await prisma.nomination.create({
          data: {
            movieId: nom.movieId,
            title: nom.title,
            poster: nom.poster || null,
            profileId,
            nightId: night.id,
          },
        });
      }
    }

    if (nominations) {
      const seen = new Set<string>();
      for (const nom of nominations) {
        if (seen.has(nom.movieId)) continue;
        seen.add(nom.movieId);

        const existing = await prisma.nomination.findUnique({
          where: {
            movieId_nightId: {
              movieId: nom.movieId,
              nightId: night.id,
            },
          },
        });

        if (!existing) {
          await prisma.nomination.create({
            data: {
              movieId: nom.movieId,
              title: nom.title,
              poster: nom.poster || null,
              profileId: nom.profileId,
              nightId: night.id,
            },
          });
        }
      }
    }

    return NextResponse.json(night, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const nights = await prisma.movieNight.findMany({
      orderBy: { date: "desc" },
      include: {
        nominations: true,
        votes: true,
      },
    });
    return NextResponse.json(nights);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch movie nights" },
      { status: 500 }
    );
  }
}

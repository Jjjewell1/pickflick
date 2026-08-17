import { NextResponse } from "next/server";
import { getMovies, getGenres, isConfigured } from "@/lib/jellyfin";

export async function GET(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Jellyfin not configured. Set JELLYFIN_URL and JELLYFIN_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "genres") {
      const genres = await getGenres();
      return NextResponse.json({ genres });
    }

    if (action === "movies") {
      const genre = searchParams.get("genre") || undefined;
      const maxRating = searchParams.get("maxRating") || undefined;
      const movies = await getMovies(genre, maxRating);
      return NextResponse.json({ movies });
    }

    return NextResponse.json(
      { error: "Invalid action. Use ?action=genres or ?action=movies" },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

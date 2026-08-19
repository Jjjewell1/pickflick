import { NextResponse } from "next/server";
import { getMovies, isConfigured, getMaxRating } from "@/lib/jellyfin";
import { isAIConfigured, getOpenAI } from "@/lib/ai";

interface SuggestRequest {
  profiles: { name: string; ageTier: string; emoji: string }[];
  genre?: string;
  excludeIds?: string[];
}

async function askAIForPicks(
  movieList: { id: string; name: string; contentRating?: string; genres?: string[]; overview?: string; communityRating?: number }[],
  profiles: { name: string; ageTier: string }[],
  genre?: string
): Promise<string[]> {
  const movieSummaries = movieList
    .map(
      (m) =>
        `- ${m.name} (ID: ${m.id}, Rating: ${m.contentRating || "NR"}, Genres: ${m.genres?.join(", ") || "N/A"}${m.overview ? `, About: ${m.overview.slice(0, 120)}` : ""})`
    )
    .join("\n");

  const profileSummary = profiles
    .map((p) => `- ${p.name} (${p.ageTier})`)
    .join("\n");

  const genreHint = genre ? `\nThe family specifically wants to watch something in the "${genre}" genre tonight.` : "";

  const systemPrompt = `You are a movie night advisor for a family. You suggest movies from their Jellyfin library that everyone will enjoy. You are fun, witty, and understand what works for different age groups.

Rules:
- Consider age ratings carefully: kids need G/PG, teens can handle PG-13, adults can watch anything
- Suggest movies that have broad appeal across the age groups present
- Prioritize highly-rated movies and well-known crowd-pleasers
- Avoid movies that might bore kids or be too childish for adults
- Return ONLY a JSON array of movie IDs (strings), no explanations. Pick exactly 6 movies.
- Return valid JSON only, no markdown`;

  const userPrompt = `Here are the family members:
${profileSummary}
${genreHint}

Here are movies from our library:
${movieSummaries}

Pick the 6 best movies for tonight. Return a JSON array of movie IDs only.`;

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content || "[]";

  const jsonMatch = content.match(/\[[\s\S]*?\]/);
  if (!jsonMatch) return [];

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Jellyfin not configured." },
      { status: 503 }
    );
  }

  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI not configured. Set OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const body: SuggestRequest = await req.json();
    const { profiles, genre, excludeIds = [] } = body;

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: "At least one profile is required." }, { status: 400 });
    }

    const maxRating = getMaxRating(profiles);
    const movies = await getMovies(genre || undefined, maxRating || undefined);

    const excludeSet = new Set(excludeIds);
    const filtered = movies.filter(
      (m) => !excludeSet.has(m.Id) && !m.UserData?.Played
    );

    if (filtered.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const movieData = filtered.map((m) => ({
      id: m.Id,
      name: m.Name,
      contentRating: m.OfficialRating,
      genres: m.Genres,
      overview: m.Overview,
      communityRating: m.CommunityRating,
    }));

    const pickedIds = await askAIForPicks(movieData, profiles, genre);

    const pickedSet = new Set(pickedIds);
    const suggestions = filtered
      .filter((m) => pickedSet.has(m.Id))
      .slice(0, 6)
      .map((m) => ({
        id: m.Id,
        name: m.Name,
        poster: `/api/jellyfin/image?id=${m.Id}`,
        rating: m.OfficialRating,
        genres: m.Genres,
        overview: m.Overview,
        communityRating: m.CommunityRating,
      }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI suggest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

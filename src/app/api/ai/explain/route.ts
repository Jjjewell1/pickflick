import { NextResponse } from "next/server";
import { isAIConfigured, getOpenAI } from "@/lib/ai";

interface ExplainRequest {
  title: string;
  genres?: string[];
  overview?: string;
  profiles: { name: string; ageTier: string }[];
  genre?: string;
}

export async function POST(req: Request) {
  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI not configured. Set OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const body: ExplainRequest = await req.json();
    const { title, genres, overview, profiles, genre } = body;

    if (!title) {
      return NextResponse.json({ error: "title is required." }, { status: 400 });
    }

    const profileSummary = profiles.map((p) => `${p.name} (${p.ageTier})`).join(", ");
    const genreContext = genre ? `They chose the "${genre}" genre.` : "";

    const response = await getOpenAI().chat.completions.create({
      model: "phi4-mini:3.8b",
      messages: [
        {
          role: "system",
          content: `You are a witty movie night announcer. Generate a fun, punchy one-liner (max 25 words) explaining why this movie won the family's movie night vote. Be playful and enthusiastic. No quotes, no emojis, just the line.`,
        },
        {
          role: "user",
          content: `"${title}" won movie night.
Family: ${profileSummary}
${genreContext}
Genres: ${genres?.join(", ") || "N/A"}
About: ${overview?.slice(0, 200) || "N/A"}

Write the one-liner.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 60,
    });

    const line = response.choices[0]?.message?.content?.trim() || "The crowd has spoken!";

    return NextResponse.json({ line });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI explain failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

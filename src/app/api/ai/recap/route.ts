import { NextResponse } from "next/server";
import { isAIConfigured, getOpenAI } from "@/lib/ai";

interface RecapRequest {
  winner: string;
  genre: string;
  profiles: { name: string; ageTier: string }[];
  nominations: { title: string; profileName: string }[];
  rounds: number;
}

export async function POST(req: Request) {
  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI not configured. Set OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const body: RecapRequest = await req.json();
    const { winner, genre, profiles, nominations, rounds } = body;

    const profileSummary = profiles.map((p) => `${p.name} (${p.ageTier})`).join(", ");
    const nomSummary = nominations.map((n) => `${n.profileName} nominated "${n.title}"`).join("\n");

    const response = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a fun movie night recap writer. Write a short, entertaining recap (2-3 sentences max) of a family movie night. Be witty and warm. No emojis.`,
        },
        {
          role: "user",
          content: `Movie Night Recap:
- Genre: ${genre}
- Family: ${profileSummary}
- Nominations:
${nomSummary || "No nominations recorded"}
- Winner: "${winner}"
- Rounds of voting: ${rounds}

Write the recap.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const recap = response.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ recap });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI recap failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

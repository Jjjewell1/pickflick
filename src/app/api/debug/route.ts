import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/jellyfin";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.JELLYFIN_URL || "(not set)";
  const key = process.env.JELLYFIN_API_KEY ? "(set, length=" + process.env.JELLYFIN_API_KEY.length + ")" : "(not set)";

  let connectivity = "not tested";
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    connectivity = `${res.status} ${res.statusText}`;
  } catch (e) {
    connectivity = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    jellyfinUrl: url,
    apiKeyStatus: key,
    isConfigured,
    connectivity,
  });
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.JELLYFIN_URL || "(not set)";
  const key = process.env.JELLYFIN_API_KEY || "";

  let connectivity = "not tested";
  let apiUrl = "not tested";
  let apiStatus = 0;
  let apiBody = "";

  // Test base URL
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    connectivity = `${res.status} ${res.statusText}`;
  } catch (e) {
    connectivity = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test actual Jellyfin API call (same as jellyfinFetch does)
  try {
    const testUrl = new URL("/Users/Items", url);
    testUrl.searchParams.set("IncludeItemTypes", "Movie");
    testUrl.searchParams.set("Limit", "1");
    apiUrl = testUrl.toString();
    const res = await fetch(testUrl.toString(), {
      headers: {
        "X-Emby-Authorization": `MediaBrowser Token="${key}"`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });
    apiStatus = res.status;
    const text = await res.text();
    apiBody = text.substring(0, 500);
  } catch (e) {
    apiBody = `FAILED: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    jellyfinUrl: url,
    apiKeyStatus: key ? `set (${key.length} chars)` : "NOT SET",
    connectivity,
    apiUrl,
    apiStatus,
    apiBody,
  });
}

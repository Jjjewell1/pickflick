import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.JELLYFIN_URL || "";
  const key = process.env.JELLYFIN_API_KEY || "";

  try {
    // Get first user
    const usersRes = await fetch(new URL("/Users", url).toString(), {
      headers: { "X-Emby-Authorization": `MediaBrowser Token="${key}"`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    const users = await usersRes.json();
    const userId = users[0]?.Id;
    const userName = users[0]?.Name;

    // Test: get all items (no type filter)
    const allUrl = new URL(`/Users/${userId}/Items`, url);
    allUrl.searchParams.set("Recursive", "true");
    allUrl.searchParams.set("Limit", "5");
    const allRes = await fetch(allUrl.toString(), {
      headers: { "X-Emby-Authorization": `MediaBrowser Token="${key}"`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    const allData = await allRes.json();

    // Test: get movies specifically
    const movieUrl = new URL(`/Users/${userId}/Items`, url);
    movieUrl.searchParams.set("Recursive", "true");
    movieUrl.searchParams.set("IncludeItemTypes", "Movie");
    movieUrl.searchParams.set("Limit", "5");
    const movieRes = await fetch(movieUrl.toString(), {
      headers: { "X-Emby-Authorization": `MediaBrowser Token="${key}"`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    const movieData = await movieRes.json();

    // Test: get all library views
    const viewsUrl = new URL(`/Users/${userId}/Views`, url);
    const viewsRes = await fetch(viewsUrl.toString(), {
      headers: { "X-Emby-Authorization": `MediaBrowser Token="${key}"`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    const viewsData = await viewsRes.json();

    return NextResponse.json({
      user: `${userName} (${userId})`,
      views: (viewsData.Items || []).map((v: Record<string, unknown>) => ({ name: v.Name, type: v.CollectionType, id: v.Id })),
      allItemsCount: allData.TotalRecordCount,
      allItemsSample: (allData.Items || []).map((i: Record<string, unknown>) => ({ name: i.Name, type: i.Type, genres: i.Genres })),
      movieCount: movieData.TotalRecordCount,
      movieSample: (movieData.Items || []).map((i: Record<string, unknown>) => ({ name: i.Name, rating: i.OfficialRating, genres: i.Genres })),
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) });
  }
}

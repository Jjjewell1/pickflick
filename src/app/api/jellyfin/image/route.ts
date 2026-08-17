import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const maxWidth = searchParams.get("maxWidth") || "300";

  if (!movieId) {
    return NextResponse.json({ error: "movieId required" }, { status: 400 });
  }

  const jellyfinUrl = process.env.JELLYFIN_URL;
  const apiKey = process.env.JELLYFIN_API_KEY;

  if (!jellyfinUrl || !apiKey) {
    return NextResponse.json(
      { error: "Jellyfin not configured" },
      { status: 503 }
    );
  }

  try {
    const imageUrl = `${jellyfinUrl}/Items/${movieId}/Images/Primary?maxWidth=${maxWidth}&quality=80`;
    const res = await fetch(imageUrl, {
      headers: {
        "X-Emby-Authorization": `MediaBrowser Token="${apiKey}"`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

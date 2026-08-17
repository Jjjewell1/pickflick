const JELLYFIN_URL = process.env.JELLYFIN_URL || "";
const JELLYFIN_API_KEY = process.env.JELLYFIN_API_KEY || "";

export interface JellyfinMovie {
  Id: string;
  Name: string;
  OfficialRating?: string;
  Genres?: string[];
  Overview?: string;
  PremiereDate?: string;
  CommunityRating?: number;
  UserData?: {
    Played?: boolean;
    PlayedPercentage?: number;
  };
}

export interface JellyfinLibraryResponse {
  Items: JellyfinMovie[];
  TotalRecordCount: number;
}

export interface JellyfinGenre {
  Name: string;
}

export interface JellyfinUser {
  Id: string;
  Name: string;
}

const ratingOrder = ["G", "PG", "PG-13", "R", "NC-17", "NR", ""];

export function getMaxRating(participants: { ageTier: string }[]): string {
  const tierMap: Record<string, string> = {
    kid: "PG",
    teen: "PG-13",
    adult: "",
  };

  let mostRestrictive = "";
  for (const p of participants) {
    const ceiling = tierMap[p.ageTier] || "";
    if (
      mostRestrictive === "" ||
      (ceiling !== "" && ratingOrder.indexOf(ceiling) < ratingOrder.indexOf(mostRestrictive))
    ) {
      mostRestrictive = ceiling;
    }
  }
  return mostRestrictive;
}

export function isRatingAllowed(
  movieRating: string | undefined,
  maxRating: string
): boolean {
  if (!maxRating) return true;
  if (!movieRating) return true;

  const movieIdx = ratingOrder.indexOf(movieRating);
  const maxIdx = ratingOrder.indexOf(maxRating);

  if (movieIdx === -1) return true;
  return movieIdx <= maxIdx;
}

function getHeaders() {
  return {
    "X-Emby-Authorization": `MediaBrowser Token="${JELLYFIN_API_KEY}"`,
    "Content-Type": "application/json",
  };
}

let cachedUserId: string | null = null;

async function getUserId(): Promise<string> {
  if (cachedUserId) return cachedUserId;

  if (!JELLYFIN_URL || !JELLYFIN_API_KEY) {
    throw new Error("Jellyfin not configured. Set JELLYFIN_URL and JELLYFIN_API_KEY.");
  }

  const url = new URL("/Users", JELLYFIN_URL);
  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Jellyfin API error fetching users: ${res.status} ${res.statusText}`);
  }

  const users = (await res.json()) as JellyfinUser[];
  if (!users || users.length === 0) {
    throw new Error("No Jellyfin users found. Create a user first.");
  }

  cachedUserId = users[0].Id;
  return cachedUserId;
}

export async function jellyfinFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  if (!JELLYFIN_URL || !JELLYFIN_API_KEY) {
    throw new Error(
      "Jellyfin not configured. Set JELLYFIN_URL and JELLYFIN_API_KEY."
    );
  }

  const userId = await getUserId();
  const url = new URL(endpoint.replace(":userId", userId), JELLYFIN_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Jellyfin API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getMovies(
  genre?: string,
  maxRating?: string
): Promise<JellyfinMovie[]> {
  const params: Record<string, string> = {
    IncludeItemTypes: "Movie",
    Recursive: "true",
    Fields: "Overview,OfficialRating,Genres,UserData,CommunityRating,PremiereDate",
    Limit: "500",
  };

  if (genre) {
    params.Genres = genre;
  }

  const response = await jellyfinFetch<JellyfinLibraryResponse>(
    "/Users/:userId/Items",
    params
  );

  let movies = response.Items || [];

  if (maxRating) {
    movies = movies.filter((m) => isRatingAllowed(m.OfficialRating, maxRating));
  }

  return movies;
}

export async function getGenres(): Promise<string[]> {
  const params: Record<string, string> = {
    IncludeItemTypes: "Movie",
    Recursive: "true",
  };

  const response = await jellyfinFetch<JellyfinLibraryResponse>(
    "/Users/:userId/Items",
    params
  );

  const genreSet = new Set<string>();
  for (const movie of response.Items || []) {
    if (movie.Genres) {
      for (const g of movie.Genres) {
        genreSet.add(g);
      }
    }
  }

  return Array.from(genreSet).sort();
}

export function getPosterUrl(movieId: string, maxWidth = 300): string {
  if (!JELLYFIN_URL) return "";
  return `${JELLYFIN_URL}/Items/${movieId}/Images/Primary?maxWidth=${maxWidth}&quality=90`;
}

export function getJellyfinItemUrl(movieId: string): string {
  if (!JELLYFIN_URL) return "#";
  return `${JELLYFIN_URL}/web/index.html#!/details?id=${movieId}`;
}

export function isConfigured(): boolean {
  return !!JELLYFIN_URL && !!JELLYFIN_API_KEY;
}

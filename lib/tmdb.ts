// Token must be set via environment variable — never hardcode API keys in source
const ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN ||
  process.env.TMDB_ACCESS_TOKEN ||
  "";

async function fetchFromTMDB(endpoint: string, queryParams: Record<string, string> = {}) {
  if (!ACCESS_TOKEN) {
    console.warn("TMDB_ACCESS_TOKEN is not set — skipping fetch");
    return { results: [] };
  }

  const url = new URL(`https://api.themoviedb.org/3/${endpoint}`);
  Object.entries(queryParams).forEach(([key, val]) => {
    url.searchParams.append(key, val);
  });

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) {
      throw new Error(`TMDB error status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch from TMDB", error);
    return { results: [] };
  }
}

export interface TMDBMedia {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export async function getPopularMovies(): Promise<TMDBMedia[]> {
  const data = await fetchFromTMDB("movie/popular", { page: "1" });
  return data.results || [];
}

export async function getPopularSeries(): Promise<TMDBMedia[]> {
  const data = await fetchFromTMDB("tv/popular", { page: "1" });
  return data.results || [];
}

export async function getTrendingAll(): Promise<TMDBMedia[]> {
  const data = await fetchFromTMDB("trending/all/day", { page: "1" });
  return data.results || [];
}

export async function getPopularSports(): Promise<TMDBMedia[]> {
  // Query TMDB search for sports documentaries/movies
  const data = await fetchFromTMDB("search/movie", {
    query: "sports",
    include_adult: "false",
    page: "1",
  });
  return data.results || [];
}

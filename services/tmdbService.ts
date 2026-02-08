import { MediaItem, TmdbResponse, TmdbMovieRaw, TmdbTvRaw, MediaType, Person, Review, Episode, Collection } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'fa-IR'; // Persian language

// Helper to get key from local storage or prompt
export const getTmdbApiKey = (): string | null => {
  return localStorage.getItem('filmento_tmdb_key');
};

export const setTmdbApiKey = (key: string) => {
  localStorage.setItem('filmento_tmdb_key', key);
};

const fetchFromTmdb = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    throw new Error('MISSING_KEY');
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    language: LANGUAGE,
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
};

// --- Normalization Helpers ---

const normalizeMovie = (movie: TmdbMovieRaw): MediaItem => ({
  ...movie,
  type: 'movie',
  release_date: movie.release_date || '',
});

const normalizeTv = (tv: TmdbTvRaw): MediaItem => ({
  id: tv.id,
  type: 'tv',
  title: tv.name,
  original_title: tv.original_name,
  overview: tv.overview,
  poster_path: tv.poster_path,
  backdrop_path: tv.backdrop_path,
  release_date: tv.first_air_date || '',
  vote_average: tv.vote_average,
  vote_count: tv.vote_count,
  genre_ids: tv.genre_ids,
});

// --- Mock Data ---
const MOCK_MEDIA: MediaItem[] = [
  {
    id: 27205, type: 'movie', title: "تلقین (دمو)", original_title: "Inception",
    overview: "دزد ماهری که تخصصش دزدیدن اسرار ارزشمند از اعماق ناخودآگاه افراد در خواب است...",
    poster_path: "/9gk7admal4zl67Yrxio2DI12qKA.jpg", backdrop_path: "/s3TBrRGB1jav7loZ1Gj9t7kGWNL.jpg",
    release_date: "2010-07-15", vote_average: 8.8, vote_count: 35000
  },
  {
    id: 1399, type: 'tv', title: "بازی تاج و تخت (دمو)", original_title: "Game of Thrones",
    overview: "هفت خاندان اشرافی برای کنترل سرزمین افسانه‌ای وستروس می‌جنگند...",
    poster_path: "/1XS1oqL89opfnbGw83trg95trUR.jpg", backdrop_path: "/2OMB0ynKlyIenMJt85r4bJjFStD.jpg",
    release_date: "2011-04-17", vote_average: 8.4, vote_count: 22000
  }
];

// --- API Calls ---

export const getTrending = async (type: MediaType): Promise<MediaItem[]> => {
  try {
    const endpoint = type === 'movie' ? '/trending/movie/week' : '/trending/tv/week';
    const data = await fetchFromTmdb<TmdbResponse<any>>(endpoint);
    
    return data.results.map((item: any) => 
      type === 'movie' ? normalizeMovie(item) : normalizeTv(item)
    );
  } catch (error) {
    if ((error as Error).message === 'MISSING_KEY') return MOCK_MEDIA.filter(m => m.type === type);
    console.error("Failed to fetch trending:", error);
    return [];
  }
};

export const searchMedia = async (query: string): Promise<MediaItem[]> => {
  try {
    if (!query) return [];
    const data = await fetchFromTmdb<TmdbResponse<any>>('/search/multi', { query });
    
    return data.results
      .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item: any) => item.media_type === 'movie' ? normalizeMovie(item) : normalizeTv(item));

  } catch (error) {
    console.error("Failed to search:", error);
    return [];
  }
};

export const getMediaDetails = async (id: number, type: MediaType): Promise<MediaItem | null> => {
  try {
    const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
    // Fetch credits, videos, and recommendations in one go
    const data = await fetchFromTmdb<any>(endpoint, { append_to_response: 'credits,videos,recommendations' });
    
    const base = type === 'movie' ? normalizeMovie(data) : normalizeTv(data);
    
    base.genres = data.genres;
    if (type === 'movie') {
        base.runtime = data.runtime;
        base.belongs_to_collection = data.belongs_to_collection;
    }
    if (type === 'tv') {
        base.number_of_seasons = data.number_of_seasons;
        base.seasons = data.seasons;
    }
    
    base.credits = data.credits;
    base.videos = data.videos;
    
    // Normalize recommendations
    if (data.recommendations?.results) {
        base.recommendations = {
            results: data.recommendations.results.map((r: any) => 
                r.media_type === 'tv' ? normalizeTv(r) : normalizeMovie(r)
            )
        };
    }

    return base;
  } catch (error) {
    if ((error as Error).message === 'MISSING_KEY') {
        const mock = MOCK_MEDIA.find(m => m.id === id && m.type === type);
        return mock || null;
    }
    console.error("Failed to fetch details:", error);
    return null;
  }
};

export const getPersonDetails = async (id: number): Promise<Person | null> => {
    try {
        const data = await fetchFromTmdb<any>(`/person/${id}`, { append_to_response: 'combined_credits' });
        
        const cast = (data.combined_credits?.cast || [])
            .filter((c: any) => c.media_type === 'movie' || c.media_type === 'tv')
            .filter((c: any) => c.poster_path)
            .map((c: any) => c.media_type === 'movie' ? normalizeMovie(c) : normalizeTv(c))
            .sort((a: MediaItem, b: MediaItem) => b.vote_count - a.vote_count)
            .slice(0, 15);

        return {
            id: data.id,
            name: data.name,
            biography: data.biography,
            birthday: data.birthday,
            place_of_birth: data.place_of_birth,
            profile_path: data.profile_path,
            known_for_department: data.known_for_department,
            combined_credits: { cast }
        };

    } catch (error) {
        console.error("Failed to fetch person:", error);
        return null;
    }
};

export const getTmdbReviews = async (id: number, type: MediaType): Promise<Review[]> => {
    try {
        const endpoint = type === 'movie' ? `/movie/${id}/reviews` : `/tv/${id}/reviews`;
        const data = await fetchFromTmdb<TmdbResponse<any>>(endpoint, { language: 'en-US' }); 
        
        return data.results.map((r: any) => ({
            id: r.id,
            author: r.author,
            avatar: r.author_details?.avatar_path ? (r.author_details.avatar_path.startsWith('/') ? getImageUrl(r.author_details.avatar_path) : r.author_details.avatar_path.substring(1)) : null,
            content: r.content,
            rating: r.author_details?.rating || null,
            created_at: r.created_at,
            source: 'tmdb'
        }));
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
};

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<Episode[]> => {
    try {
        const data = await fetchFromTmdb<any>(`/tv/${tvId}/season/${seasonNumber}`);
        return data.episodes || [];
    } catch (error) {
        console.error("Failed to fetch season details:", error);
        return [];
    }
};

export const getCollectionDetails = async (collectionId: number): Promise<Collection | null> => {
    try {
        const data = await fetchFromTmdb<any>(`/collection/${collectionId}`);
        return {
            id: data.id,
            name: data.name,
            overview: data.overview,
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            parts: data.parts.map((p: any) => normalizeMovie(p))
                .sort((a: MediaItem, b: MediaItem) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
        };
    } catch (error) {
        console.error("Failed to fetch collection:", error);
        return null;
    }
};

export const discoverByGenre = async (genreId: number, type: MediaType): Promise<MediaItem[]> => {
    try {
        const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
        const data = await fetchFromTmdb<TmdbResponse<any>>(endpoint, { 
            with_genres: genreId.toString(),
            sort_by: 'popularity.desc'
        });
        
        return data.results.map((item: any) => 
            type === 'movie' ? normalizeMovie(item) : normalizeTv(item)
        );
    } catch (error) {
        console.error("Failed to discover by genre:", error);
        return [];
    }
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://picsum.photos/500/750?blur=2';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

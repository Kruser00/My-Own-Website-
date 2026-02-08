import { MediaItem, TmdbResponse, TmdbMovieRaw, TmdbTvRaw, MediaType } from '../types';

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
    // Multi-search includes people, so we prefer specific endpoints or filtering
    // Let's search both and combine for a better "Simulated unified search" or just use multi
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
    const data = await fetchFromTmdb<any>(endpoint, { append_to_response: 'credits' });
    
    // Normalize detail response which is slightly different from list response but close enough for our props
    const base = type === 'movie' ? normalizeMovie(data) : normalizeTv(data);
    
    // Add detail specific fields
    base.genres = data.genres;
    if (type === 'movie') base.runtime = data.runtime;
    if (type === 'tv') base.number_of_seasons = data.number_of_seasons;
    base.credits = data.credits;

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

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://picsum.photos/500/750?blur=2';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

import { Movie, TmdbResponse } from '../types';

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

// --- Mock Data for Demo when no key is present ---
const MOCK_MOVIES: Movie[] = [
  {
    id: 27205,
    title: "تلقین (دمو)",
    original_title: "Inception",
    overview: "دزد ماهری که تخصصش دزدیدن اسرار ارزشمند از اعماق ناخودآگاه افراد در خواب است، این بار ماموریتی غیرممکن دریافت می‌کند...",
    poster_path: "/9gk7admal4zl67Yrxio2DI12qKA.jpg",
    backdrop_path: "/s3TBrRGB1jav7loZ1Gj9t7kGWNL.jpg",
    release_date: "2010-07-15",
    vote_average: 8.8,
    vote_count: 35000,
    genre_ids: [28, 878, 12]
  },
  {
    id: 157336,
    title: "میان‌ستاره‌ای (دمو)",
    original_title: "Interstellar",
    overview: "گروهی از کاشفان با استفاده از یک کرم‌چاله که به تازگی کشف شده، سفر فضایی انسان را فراتر از محدودیت‌های قبلی می‌برند...",
    poster_path: "/gEU2QniL6E8ahEoXxf9uPjqJDY9.jpg",
    backdrop_path: "/xJHokMBLlb5Kd0BLWOxaz5ipfqw.jpg",
    release_date: "2014-11-05",
    vote_average: 8.7,
    vote_count: 33000,
    genre_ids: [12, 18, 878]
  },
  {
    id: 155,
    title: "شوالیه تاریکی (دمو)",
    original_title: "The Dark Knight",
    overview: "بتمن با کمک ستوان جیم گوردون و دادستان هاروی دنت، شروع به نابودی سازمان‌های تبهکاری در گاتهام می‌کند...",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 31000,
    genre_ids: [18, 28, 80, 53]
  }
];

export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const data = await fetchFromTmdb<TmdbResponse<Movie>>('/trending/movie/week');
    return data.results;
  } catch (error) {
    if ((error as Error).message === 'MISSING_KEY') return MOCK_MOVIES;
    console.error("Failed to fetch trending:", error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    if (!query) return [];
    const data = await fetchFromTmdb<TmdbResponse<Movie>>('/search/movie', { query });
    return data.results;
  } catch (error) {
    console.error("Failed to search:", error);
    return [];
  }
};

export const getMovieDetails = async (id: number): Promise<Movie | null> => {
  try {
    const data = await fetchFromTmdb<Movie>(`/movie/${id}`, { append_to_response: 'credits' });
    return data;
  } catch (error) {
    if ((error as Error).message === 'MISSING_KEY') {
        const mock = MOCK_MOVIES.find(m => m.id === id);
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

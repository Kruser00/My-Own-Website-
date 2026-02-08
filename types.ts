export type MediaType = 'movie' | 'tv';

export interface MediaItem {
  id: number;
  type: MediaType;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string; // Used for both release_date (movie) and first_air_date (tv)
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number; // For movies
  number_of_seasons?: number; // For TV
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  combined_credits: {
    cast: MediaItem[];
  };
}

export interface Review {
  id: string;
  author: string;
  avatar: string | null;
  content: string;
  rating: number | null;
  created_at: string;
  source: 'tmdb' | 'user';
}

// Raw TMDB interfaces for internal casting
export interface TmdbMovieRaw {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface TmdbTvRaw {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface TmdbResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface UserLists {
  watchlist: MediaItem[];
  watched: MediaItem[];
}

import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { getTrendingMovies } from '../services/tmdbService';
import { MovieCard } from '../components/MovieCard';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';

interface HomePageProps {
  onMovieClick: (id: number) => void;
  searchResults: Movie[] | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onMovieClick, searchResults }) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const movies = await getTrendingMovies();
      setTrending(movies);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  if (loading && !searchResults) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-filmento-yellow" size={48} />
      </div>
    );
  }

  // Display Search Results if active
  if (searchResults) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
         <h2 className="text-2xl font-bold text-filmento-yellow mb-6 flex items-center gap-2">
           نتایج جستجو
        </h2>
        {searchResults.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            موردی یافت نشد.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {searchResults.map(movie => (
              <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section using the first trending movie */}
      {trending.length > 0 && (
        <div className="relative w-full h-[500px] md:h-[600px]">
          <div className="absolute inset-0">
             <img 
               src={`https://image.tmdb.org/t/p/original${trending[0].backdrop_path}`}
               alt={trending[0].title}
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-filmento-dark via-filmento-dark/60 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-filmento-dark via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-end pb-16">
            <div className="max-w-2xl space-y-4">
               <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
                 {trending[0].title}
               </h1>
               <div className="flex items-center gap-4 text-sm md:text-base text-gray-300">
                  <span className="flex items-center gap-1 text-filmento-yellow">
                    <TrendingUp size={18} />
                    {trending[0].vote_average.toFixed(1)} امتیاز
                  </span>
                  <span>{trending[0].release_date.split('-')[0]}</span>
               </div>
               <p className="text-gray-300 line-clamp-3 text-lg leading-relaxed shadow-black drop-shadow-sm">
                 {trending[0].overview}
               </p>
               <div className="pt-4 flex gap-4">
                 <button onClick={() => onMovieClick(trending[0].id)} className="bg-filmento-yellow hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded text-lg transition">
                   اطلاعات بیشتر
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending List */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6 border-l-4 border-filmento-yellow pl-4">
            <h2 className="text-2xl font-bold text-white">محبوب‌ترین‌های هفته</h2>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="relative">
            <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x">
                {trending.map(movie => (
                    <div key={movie.id} className="snap-start">
                        <MovieCard movie={movie} onClick={onMovieClick} />
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Fallback info for demo */}
      {trending.length > 0 && trending[0].title.includes("(دمو)") && (
        <div className="max-w-7xl mx-auto px-4 mt-8">
            <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-filmento-yellow shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                    <p className="font-bold text-white mb-1">حالت دمو فعال است</p>
                    <p>برای مشاهده اطلاعات واقعی و به‌روز، لطفا کلید API سایت TMDB خود را در بخش تنظیمات وارد کنید.</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

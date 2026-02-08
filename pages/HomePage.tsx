import React, { useEffect, useState } from 'react';
import { MediaItem, MediaType, Genre } from '../types';
import { getTrending, getTopRated, getUpcoming, getGenresList } from '../services/tmdbService';
import { MediaCard } from '../components/MovieCard';
import { Loader2, TrendingUp, AlertCircle, Film, Tv, ChevronLeft, ChevronRight, Star, Calendar, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onMediaClick: (id: number, type: MediaType) => void;
  onGenreClick: (genre: Genre, type: MediaType) => void;
  searchResults: MediaItem[] | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onMediaClick, onGenreClick, searchResults }) => {
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTv, setTrendingTv] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [topRatedTv, setTopRatedTv] = useState<MediaItem[]>([]);
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

  const { lists, user } = useAuth();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendMovieData, trendTvData, topMovieData, topTvData, upData, genreData] = await Promise.all([
            getTrending('movie'),
            getTrending('tv'),
            getTopRated('movie'),
            getTopRated('tv'),
            getUpcoming(),
            getGenresList('movie')
        ]);
        setTrendingMovies(trendMovieData);
        setTrendingTv(trendTvData);
        setTopRatedMovies(topMovieData);
        setTopRatedTv(topTvData);
        setUpcoming(upData);
        setGenres(genreData);
      } catch (e) {
          console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Carousel Auto Rotation
  useEffect(() => {
    if (trendingMovies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(5, trendingMovies.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [trendingMovies]);

  if (loading && !searchResults) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-filmento-yellow" size={48} />
      </div>
    );
  }

  // --- Search Results View ---
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
            {searchResults.map(item => (
              <MediaCard key={item.id} item={item} onClick={onMediaClick} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const heroItems = trendingMovies.slice(0, 5);

  return (
    <div className="space-y-12 pb-12 overflow-x-hidden">
      
      {/* 1. Dynamic Hero Slider */}
      {heroItems.length > 0 && (
        <div className="relative w-full h-[550px] md:h-[700px] overflow-hidden group">
          {heroItems.map((item, index) => (
             <div 
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === heroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
             >
                <img 
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/30 to-transparent" />

                <div className="absolute inset-0 flex items-end pb-20 md:pb-24">
                     <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="max-w-3xl animate-in slide-in-from-bottom-10 fade-in duration-700">
                             <div className="flex items-center gap-2 mb-2">
                                <span className="bg-filmento-yellow text-black text-xs font-bold px-2 py-0.5 rounded uppercase">
                                    {index === 0 ? 'ترند #1' : 'پیشنهاد ویژه'}
                                </span>
                                <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                    <Star size={14} fill="currentColor" /> {item.vote_average.toFixed(1)}
                                </span>
                             </div>

                             <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight" dir="ltr">
                                 {item.original_title}
                             </h1>
                             {item.title !== item.original_title && (
                                <h2 className="text-2xl md:text-3xl text-gray-300 font-bold mb-4">{item.title}</h2>
                             )}
                             
                             <p className="text-gray-200 text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl leading-relaxed">
                                 {item.overview}
                             </p>
                             
                             <div className="flex items-center gap-4">
                                 <button 
                                    onClick={() => onMediaClick(item.id, item.type)}
                                    className="bg-filmento-yellow text-black font-bold px-8 py-3.5 rounded-lg flex items-center gap-2 hover:bg-yellow-400 transition transform hover:scale-105"
                                 >
                                     <Info size={20} />
                                     اطلاعات بیشتر
                                 </button>
                             </div>
                        </div>
                     </div>
                </div>
             </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-8 right-4 md:right-12 z-20 flex gap-2">
             <button onClick={() => setHeroIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length)} className="p-2 bg-black/50 text-white rounded-full hover:bg-filmento-yellow hover:text-black transition border border-white/10">
                 <ChevronRight size={20} />
             </button>
             <button onClick={() => setHeroIndex((prev) => (prev + 1) % heroItems.length)} className="p-2 bg-black/50 text-white rounded-full hover:bg-filmento-yellow hover:text-black transition border border-white/10">
                 <ChevronLeft size={20} />
             </button>
          </div>
          
          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
             {heroItems.map((_, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === heroIndex ? 'w-8 bg-filmento-yellow' : 'w-2 bg-gray-500 hover:bg-gray-300'}`}
                 />
             ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 space-y-16">
        
        {/* 2. Genre Pills */}
        <div>
           <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
              {genres.map(genre => (
                  <button 
                    key={genre.id}
                    onClick={() => onGenreClick(genre, 'movie')}
                    className="whitespace-nowrap px-6 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-300 hover:text-black hover:bg-filmento-yellow hover:border-filmento-yellow transition font-medium text-sm"
                  >
                      {genre.name}
                  </button>
              ))}
           </div>
        </div>

        {/* 3. Watchlist Row (Personalization) */}
        {user && lists.watchlist.length > 0 && (
            <MediaRow title="ادامه تماشا (لیست شما)" items={lists.watchlist} onMediaClick={onMediaClick} icon={<Film />} />
        )}

        {/* 4. Content Rows - Movies & TV */}
        <MediaRow title="فیلم‌های ترند هفته" items={trendingMovies} onMediaClick={onMediaClick} icon={<TrendingUp />} />
        
        <MediaRow title="سریال‌های ترند هفته" items={trendingTv} onMediaClick={onMediaClick} icon={<Tv />} />

        {/* 5. Spotlight Section */}
        {upcoming.length > 0 && (
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-2/3 h-64 md:h-[450px] relative">
                         <img 
                            src={`https://image.tmdb.org/t/p/original${upcoming[0].backdrop_path}`}
                            className="w-full h-full object-cover"
                            alt={upcoming[0].title}
                         />
                         <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-gray-900 via-transparent to-transparent" />
                    </div>
                    <div className="w-full md:w-1/3 p-8 flex flex-col justify-center text-right z-10">
                         <span className="text-filmento-yellow font-bold tracking-widest text-sm mb-2 uppercase">به زودی</span>
                         <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{upcoming[0].title}</h2>
                         <p className="text-gray-400 mb-6 line-clamp-4 leading-relaxed text-sm text-justify">
                             {upcoming[0].overview}
                         </p>
                         <div className="flex flex-col gap-3">
                             <div className="flex items-center gap-2 text-sm text-gray-300">
                                 <Calendar size={16} className="text-filmento-yellow" />
                                 <span>تاریخ اکران: {upcoming[0].release_date}</span>
                             </div>
                             <button 
                                onClick={() => onMediaClick(upcoming[0].id, upcoming[0].type)}
                                className="mt-4 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                             >
                                 مشاهده جزئیات <ArrowRight size={18} />
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        )}

        <MediaRow title="برترین‌های سینما" items={topRatedMovies} onMediaClick={onMediaClick} icon={<Star />} />
        
        <MediaRow title="برترین سریال‌های تلویزیونی" items={topRatedTv} onMediaClick={onMediaClick} icon={<Tv />} />

        <MediaRow title="به زودی در سینما" items={upcoming} onMediaClick={onMediaClick} icon={<Calendar />} />

      </div>

      {/* Demo Warning */}
      {trendingMovies.length > 0 && trendingMovies[0].title.includes("(دمو)") && (
        <div className="max-w-7xl mx-auto px-4">
            <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-filmento-yellow shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                    <p className="font-bold text-white mb-1">حالت دمو فعال است</p>
                    <p>لطفا کلید API را وارد کنید.</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// Reusable Component for Rows
const MediaRow: React.FC<{ title: string; items: MediaItem[]; onMediaClick: (id: number, type: MediaType) => void; icon?: React.ReactNode }> = ({ title, items, onMediaClick, icon }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="relative group/row">
            <div className="flex items-center gap-2 mb-4 px-2 border-r-4 border-filmento-yellow mr-2">
                {icon && <span className="text-filmento-yellow">{icon}</span>}
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            
            <div className="relative">
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x px-2">
                    {items.map(item => (
                        <div key={`${item.type}-${item.id}`} className="snap-start">
                             <MediaCard item={item} onClick={onMediaClick} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
import React, { useEffect, useState } from 'react';
import { MediaItem, MediaType } from '../types';
import { getMediaDetails, getImageUrl } from '../services/tmdbService';
import { Loader2, Calendar, Clock, Star, ArrowRight, Layers } from 'lucide-react';
import { GeminiAssistant } from '../components/GeminiAssistant';
import { useAuth } from '../context/AuthContext';

interface MediaDetailsPageProps {
  mediaId: number;
  mediaType: MediaType;
  onBack: () => void;
}

export const MediaDetailsPage: React.FC<MediaDetailsPageProps> = ({ mediaId, mediaType, onBack }) => {
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleWatchlist, toggleWatched, isInWatchlist, isWatched, user } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getMediaDetails(mediaId, mediaType);
      setItem(data);
      setLoading(false);
    };
    fetchDetails();
  }, [mediaId, mediaType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-filmento-yellow" size={48} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-white">یافت نشد.</h2>
        <button onClick={onBack} className="mt-4 text-filmento-yellow hover:underline">بازگشت</button>
      </div>
    );
  }

  const cast = item.credits?.cast.slice(0, 10) || [];
  const directors = item.credits?.crew.filter(c => c.job === 'Director' || c.job === 'Executive Producer') || [];
  
  const inWatchlist = isInWatchlist(item.id);
  const watched = isWatched(item.id);

  const handleAction = (action: () => void) => {
    if (!user) { alert("لطفا وارد شوید"); return; }
    action();
  }

  // Context for Gemini
  const geminiContext = `
    عنوان: ${item.title} (${item.original_title})
    نوع: ${item.type === 'movie' ? 'فیلم سینمایی' : 'سریال تلویزیونی'}
    امتیاز: ${item.vote_average}
    خلاصه: ${item.overview}
    ژانرها: ${item.genres?.map(g => g.name).join(', ')}
    عوامل: ${directors.map(d => d.name).join(', ')}
  `;

  return (
    <div className="min-h-screen bg-filmento-dark text-white pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-400 hover:text-filmento-yellow transition"
        >
          <ArrowRight size={20} />
          بازگشت به خانه
        </button>
      </div>

      {/* Header Section */}
      <div className="relative">
        {/* Backdrop */}
        <div className="h-[300px] md:h-[500px] w-full relative">
             <img 
               src={getImageUrl(item.backdrop_path, 'original')}
               alt={item.title}
               className="w-full h-full object-cover opacity-50"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-filmento-dark to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 -mt-32 md:-mt-64 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
               <img 
                 src={getImageUrl(item.poster_path)}
                 alt={item.title}
                 className="w-48 md:w-72 rounded-lg shadow-2xl border-4 border-gray-800"
               />
               
               {/* Action Buttons Mobile/Desktop */}
               <div className="mt-4 flex flex-col gap-2">
                   <button 
                      onClick={() => handleAction(() => toggleWatchlist(item))}
                      className={`w-full py-2 rounded font-bold border transition ${inWatchlist ? 'bg-filmento-yellow text-black border-filmento-yellow' : 'bg-transparent text-white border-gray-600 hover:border-white'}`}
                   >
                       {inWatchlist ? 'در لیست تماشا' : 'افزودن به لیست تماشا'}
                   </button>
                   <button 
                      onClick={() => handleAction(() => toggleWatched(item))}
                      className={`w-full py-2 rounded font-bold border transition ${watched ? 'bg-green-600 text-white border-green-600' : 'bg-transparent text-white border-gray-600 hover:border-white'}`}
                   >
                       {watched ? 'دیده شده' : 'تیک دیده شده'}
                   </button>
               </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-4 md:pt-32 text-center md:text-right">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white">{item.title}</h1>
              <p className="text-gray-400 text-lg mb-4">{item.original_title}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-6 text-sm md:text-base">
                <div className="flex items-center gap-1 text-filmento-yellow font-bold">
                    <Star fill="currentColor" size={20} />
                    <span className="text-lg">{item.vote_average.toFixed(1)}</span>
                    <span className="text-gray-500 font-normal">/10</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                    <Calendar size={18} />
                    {item.release_date}
                </div>
                
                {item.type === 'movie' && item.runtime && (
                    <div className="flex items-center gap-1 text-gray-300">
                        <Clock size={18} />
                        {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
                    </div>
                )}
                
                {item.type === 'tv' && item.number_of_seasons && (
                    <div className="flex items-center gap-1 text-gray-300">
                        <Layers size={18} />
                        {item.number_of_seasons} فصل
                    </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                {item.genres?.map(g => (
                    <span key={g.id} className="border border-gray-600 px-3 py-1 rounded-full text-sm text-gray-300 hover:border-filmento-yellow hover:text-filmento-yellow transition cursor-default">
                        {g.name}
                    </span>
                ))}
              </div>

              {/* Overview */}
              <div className="max-w-3xl">
                  <h3 className="text-xl font-bold mb-2 text-filmento-yellow">خلاصه داستان</h3>
                  <p className="text-gray-300 leading-relaxed text-lg text-justify">
                    {item.overview || "خلاصه‌ای برای این اثر ثبت نشده است."}
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-2xl font-bold text-filmento-yellow mb-6 border-r-4 border-filmento-yellow pr-3">بازیگران اصلی</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cast.map(person => (
                <div key={person.id} className="bg-filmento-card rounded-lg overflow-hidden shadow">
                    <img 
                        src={getImageUrl(person.profile_path)} 
                        alt={person.name}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                        <p className="font-bold text-white text-sm truncate">{person.name}</p>
                        <p className="text-gray-500 text-xs truncate">{person.character}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Floating AI Assistant specialized for this movie */}
      <GeminiAssistant context={geminiContext} />
    </div>
  );
};

import React from 'react';
import { Star, Info, Check, Bookmark, Plus } from 'lucide-react';
import { MediaItem } from '../types';
import { getImageUrl } from '../services/tmdbService';
import { useAuth } from '../context/AuthContext';

interface MediaCardProps {
  item: MediaItem;
  onClick: (id: number, type: 'movie' | 'tv') => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const { user, isInWatchlist, isWatched, toggleWatchlist, toggleWatched } = useAuth();

  const inWatchlist = isInWatchlist(item.id);
  const watched = isWatched(item.id);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!user) {
        // Could trigger login toast
        alert("لطفا ابتدا وارد شوید");
        return;
    }
    action();
  };

  return (
    <div 
      className="bg-filmento-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group w-[160px] sm:w-[200px] flex-shrink-0 relative"
      onClick={() => onClick(item.id, item.type)}
    >
      {/* Type Badge */}
      <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
        {item.type === 'movie' ? 'سینمایی' : 'سریال'}
      </div>

      {/* Watched Overlay Badge */}
      {watched && (
        <div className="absolute top-2 left-2 z-20 bg-green-600 text-white p-1 rounded-full shadow-lg">
            <Check size={12} strokeWidth={4} />
        </div>
      )}

      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={getImageUrl(item.poster_path)} 
          alt={item.original_title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Info fill="white" size={48} className="text-white drop-shadow-lg" />
        </div>
      </div>
      
      <div className="p-3 flex flex-col h-auto justify-between">
        <div className="min-h-[3.5em]">
            <div className="flex items-center gap-1 text-gray-400 mb-1 text-xs">
                <Star size={14} className="text-filmento-yellow" fill="#f5c518" />
                <span className="text-gray-200 font-bold">{item.vote_average.toFixed(1)}</span>
                <span className="text-gray-500">({item.vote_count})</span>
            </div>
            
            {/* Main Title (English/Original) */}
            <h3 className="font-bold text-white text-sm line-clamp-1 leading-snug group-hover:text-filmento-yellow transition-colors" dir="ltr">
            {item.original_title}
            </h3>

            {/* Subtitle (Farsi) */}
            {item.title && item.title !== item.original_title && (
              <p className="text-xs text-gray-500 truncate mt-0.5 font-sans text-right" dir="rtl">
                  {item.title}
              </p>
            )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-3">
             <button 
                onClick={(e) => handleAction(e, () => toggleWatchlist(item))}
                className={`flex-1 py-1.5 rounded flex items-center justify-center transition-colors ${inWatchlist ? 'bg-filmento-yellow text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="افزودن به لیست تماشا"
             >
                {inWatchlist ? <Bookmark fill="currentColor" size={16} /> : <Plus size={16} />}
             </button>
             <button 
                onClick={(e) => handleAction(e, () => toggleWatched(item))}
                className={`flex-1 py-1.5 rounded flex items-center justify-center transition-colors ${watched ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                title="دیده شده"
             >
                <Check size={16} strokeWidth={3} />
             </button>
        </div>
      </div>
    </div>
  );
};
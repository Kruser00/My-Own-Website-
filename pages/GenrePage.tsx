import React, { useEffect, useState } from 'react';
import { MediaItem, MediaType, Genre } from '../types';
import { discoverByGenre } from '../services/tmdbService';
import { MediaCard } from '../components/MovieCard';
import { Loader2, ArrowRight } from 'lucide-react';

interface GenrePageProps {
  genre: Genre;
  type: MediaType;
  onBack: () => void;
  onMediaClick: (id: number, type: MediaType) => void;
}

export const GenrePage: React.FC<GenrePageProps> = ({ genre, type, onBack, onMediaClick }) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenre = async () => {
      setLoading(true);
      const data = await discoverByGenre(genre.id, type);
      setItems(data);
      setLoading(false);
    };
    fetchGenre();
    window.scrollTo(0, 0);
  }, [genre.id, type]);

  return (
    <div className="min-h-screen bg-filmento-dark pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
             <button 
                onClick={onBack} 
                className="bg-gray-800 p-2 rounded-full hover:bg-filmento-yellow hover:text-black transition text-white"
             >
                <ArrowRight size={24} />
             </button>
             <div>
                 <span className="text-sm text-gray-400 block mb-1">
                     {type === 'movie' ? 'فیلم‌های' : 'سریال‌های'}
                 </span>
                 <h1 className="text-3xl font-bold text-white">{genre.name}</h1>
             </div>
        </div>

        {loading ? (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-filmento-yellow" size={48} />
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map(item => (
                    <MediaCard key={item.id} item={item} onClick={onMediaClick} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

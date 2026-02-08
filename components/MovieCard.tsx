import React from 'react';
import { Star, Play } from 'lucide-react';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdbService';

interface MovieCardProps {
  movie: Movie;
  onClick: (id: number) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      className="bg-filmento-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group w-[160px] sm:w-[200px] flex-shrink-0"
      onClick={() => onClick(movie.id)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Play fill="white" size={48} className="text-white drop-shadow-lg" />
        </div>
      </div>
      
      <div className="p-3 flex flex-col h-32 justify-between">
        <div>
            <div className="flex items-center gap-1 text-gray-400 mb-1 text-xs">
                <Star size={14} className="text-filmento-yellow" fill="#f5c518" />
                <span className="text-gray-200 font-bold">{movie.vote_average.toFixed(1)}</span>
                <span className="text-gray-500">({movie.vote_count})</span>
            </div>
            <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug group-hover:text-filmento-yellow transition-colors">
            {movie.title}
            </h3>
        </div>
        
        <button className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-filmento-yellow text-xs font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1">
           <span className="text-xl leading-none">+</span> لیست تماشا
        </button>
      </div>
    </div>
  );
};

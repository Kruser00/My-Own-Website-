import React, { useState } from 'react';
import { Season, Episode } from '../types';
import { getSeasonDetails, getImageUrl } from '../services/tmdbService';
import { ChevronDown, ChevronUp, Play, Clock, Calendar } from 'lucide-react';

interface SeasonListProps {
  tvId: number;
  seasons: Season[];
}

export const SeasonList: React.FC<SeasonListProps> = ({ tvId, seasons }) => {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Record<number, Episode[]>>({});
  const [loading, setLoading] = useState(false);

  // Filter out season 0 (Specials) if preferred, or keep them. keeping for now.
  const sortedSeasons = [...seasons].sort((a, b) => a.season_number - b.season_number);

  const toggleSeason = async (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      return;
    }

    setExpandedSeason(seasonNumber);

    if (!episodes[seasonNumber]) {
      setLoading(true);
      const data = await getSeasonDetails(tvId, seasonNumber);
      setEpisodes(prev => ({ ...prev, [seasonNumber]: data }));
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-filmento-yellow mb-6 border-r-4 border-filmento-yellow pr-3">فصل‌ها و قسمت‌ها</h2>
      <div className="space-y-4">
        {sortedSeasons.map(season => (
          <div key={season.id} className="bg-filmento-card border border-gray-700 rounded-xl overflow-hidden">
            <button 
              onClick={() => toggleSeason(season.season_number)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition text-right"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-16 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                    {season.poster_path ? (
                        <img src={getImageUrl(season.poster_path)} alt={season.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Img</div>
                    )}
                 </div>
                 <div>
                     <h3 className="font-bold text-white text-lg">{season.name}</h3>
                     <p className="text-sm text-gray-400">{season.episode_count} قسمت • {season.air_date?.split('-')[0]}</p>
                 </div>
              </div>
              <div className="text-filmento-yellow">
                {expandedSeason === season.season_number ? <ChevronUp /> : <ChevronDown />}
              </div>
            </button>

            {expandedSeason === season.season_number && (
              <div className="border-t border-gray-700 bg-gray-900/50 p-4 animate-in slide-in-from-top-2 duration-200">
                {loading && !episodes[season.season_number] ? (
                   <div className="text-center py-4 text-gray-400">در حال بارگذاری قسمت‌ها...</div>
                ) : (
                   <div className="space-y-4">
                      {episodes[season.season_number]?.map(ep => (
                          <div key={ep.id} className="flex flex-col md:flex-row gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition border border-transparent hover:border-gray-700">
                              <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-black">
                                  {ep.still_path ? (
                                      <img src={getImageUrl(ep.still_path, 'original')} alt={ep.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-700"><Play size={24} /></div>
                                  )}
                                  <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white">
                                      {ep.runtime}m
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-white mb-1">
                                          {ep.episode_number}. {ep.name}
                                      </h4>
                                      <div className="flex items-center gap-1 text-xs text-gray-400">
                                          <StarIcon rating={ep.vote_average} />
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                      <span className="flex items-center gap-1"><Calendar size={12}/> {ep.air_date}</span>
                                  </div>
                                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-2 md:line-clamp-3">
                                      {ep.overview || "خلاصه‌ای ثبت نشده است."}
                                  </p>
                              </div>
                          </div>
                      ))}
                      {episodes[season.season_number]?.length === 0 && (
                          <p className="text-gray-500 text-center">اطلاعات قسمت‌ها یافت نشد.</p>
                      )}
                   </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StarIcon = ({rating}: {rating: number}) => (
    <div className="flex items-center gap-1 text-filmento-yellow">
        <span>★</span>
        <span>{rating.toFixed(1)}</span>
    </div>
);

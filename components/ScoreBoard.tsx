import React from 'react';
import { Star } from 'lucide-react';

interface ScoreBoardProps {
    tmdbScore: number;
    voteCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ tmdbScore, voteCount }) => {
    // Helper to simulate scores based on TMDB score
    // In a real app, this would come from an API like OMDB
    const generateScores = (base: number) => {
        const hash = Math.floor(base * 12345); // deterministic-ish
        const rt = Math.min(100, Math.max(10, Math.round(base * 10 + (hash % 15 - 5))));
        const meta = Math.min(100, Math.max(10, Math.round(base * 10 - (hash % 10))));
        return { rt, meta };
    };

    const { rt, meta } = generateScores(tmdbScore);

    return (
        <div className="flex flex-wrap gap-4 md:gap-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
            
            {/* TMDB / IMDb style */}
            <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">امتیاز TMDB</span>
                <div className="flex items-center gap-2">
                    <Star className="text-filmento-yellow fill-filmento-yellow" size={24} />
                    <div>
                        <span className="text-white text-xl font-bold">{tmdbScore.toFixed(1)}</span>
                        <span className="text-gray-500 text-xs">/10</span>
                    </div>
                </div>
                <span className="text-gray-500 text-xs mt-1">{voteCount.toLocaleString()} رای</span>
            </div>

            {/* Rotten Tomatoes (Simulated) */}
            <div className="hidden sm:block w-px bg-gray-700" />
            
            <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Rotten Tomatoes</span>
                <div className="flex items-center gap-2">
                    {/* Simple Tomato Icon Representation */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${rt >= 60 ? 'bg-red-600' : 'bg-green-600'}`}>
                        <span className="text-[10px] text-white">🍅</span>
                    </div>
                    <span className="text-white text-xl font-bold">{rt}%</span>
                </div>
            </div>

            {/* Metacritic (Simulated) */}
            <div className="hidden sm:block w-px bg-gray-700" />

            <div className="flex flex-col items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Metacritic</span>
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold text-white ${meta >= 60 ? 'bg-green-600' : meta >= 40 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        {meta}
                    </div>
                    <span className="text-white text-xl font-bold">Metascore</span>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MediaCard } from '../components/MovieCard';
import { User, Bookmark, CheckCircle, LogOut } from 'lucide-react';

interface ProfilePageProps {
    onMediaClick: (id: number, type: 'movie' | 'tv') => void;
    onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onMediaClick, onLogout }) => {
    const { user, lists } = useAuth();
    const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist');

    if (!user) return <div className="text-center py-20">لطفا وارد شوید.</div>;

    const items = activeTab === 'watchlist' ? lists.watchlist : lists.watched;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-6 mb-12 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                <img 
                    src={user.avatar || "https://ui-avatars.com/api/?background=random"} 
                    className="w-20 h-20 rounded-full border-2 border-filmento-yellow shadow-lg"
                    alt={user.name} 
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <button onClick={onLogout} className="text-red-400 hover:text-red-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-900/20 transition">
                    <LogOut size={20} />
                    <span className="hidden sm:inline">خروج</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-800 mb-8">
                <button 
                    onClick={() => setActiveTab('watchlist')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition ${activeTab === 'watchlist' ? 'border-filmento-yellow text-filmento-yellow' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <Bookmark size={20} />
                    <span className="font-bold">لیست تماشا ({lists.watchlist.length})</span>
                </button>
                <button 
                    onClick={() => setActiveTab('watched')}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition ${activeTab === 'watched' ? 'border-green-500 text-green-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    <CheckCircle size={20} />
                    <span className="font-bold">دیده شده ({lists.watched.length})</span>
                </button>
            </div>

            {/* Grid */}
            {items.length === 0 ? (
                <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                    <p>هیچ موردی در این لیست وجود ندارد.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {items.map(item => (
                        <MediaCard key={`${item.type}-${item.id}`} item={item} onClick={onMediaClick} />
                    ))}
                </div>
            )}
        </div>
    );
};

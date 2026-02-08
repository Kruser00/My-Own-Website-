import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MediaDetailsPage } from './pages/MovieDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { GenrePage } from './pages/GenrePage';
import { searchMedia, setTmdbApiKey, getTmdbApiKey } from './services/tmdbService';
import { MediaItem, MediaType, Genre } from './types';
import { X, Save, AlertTriangle, Settings } from 'lucide-react';
import { GeminiAssistant } from './components/GeminiAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';

// Inner App Component to use the Auth Context
const FilmentoApp = () => {
  const [currentView, setCurrentView] = useState<'home' | 'details' | 'login' | 'profile' | 'genre'>('home');
  const [selectedMedia, setSelectedMedia] = useState<{id: number, type: MediaType} | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<{genre: Genre, type: MediaType} | null>(null);
  const [searchResults, setSearchResults] = useState<MediaItem[] | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const key = getTmdbApiKey();
    if (key) {
      setHasKey(true);
      setApiKeyInput(key);
    }
  }, []);

  const handleMediaClick = (id: number, type: MediaType) => {
    setSelectedMedia({ id, type });
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleGenreClick = (genre: Genre, type: MediaType) => {
      setSelectedGenre({ genre, type });
      setCurrentView('genre');
  };

  const handleNavigation = (page: string) => {
      if (page === 'home') {
          setSearchResults(null);
          setCurrentView('home');
      } else if (page === 'login') {
          setCurrentView('login');
      } else if (page === 'profile') {
          setCurrentView('profile');
      }
      window.scrollTo(0, 0);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setCurrentView('home');
      return;
    }
    const results = await searchMedia(query);
    setSearchResults(results);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const saveSettings = () => {
    setTmdbApiKey(apiKeyInput);
    setHasKey(!!apiKeyInput);
    setIsSettingsOpen(false);
    window.location.reload();
  };

  const renderContent = () => {
    switch (currentView) {
        case 'login':
            return <LoginPage onLoginSuccess={() => setCurrentView('home')} onBack={() => setCurrentView('home')} />;
        case 'profile':
            return <ProfilePage onMediaClick={handleMediaClick} onLogout={() => { logout(); setCurrentView('home'); }} />;
        case 'details':
            return selectedMedia ? (
                <MediaDetailsPage 
                    mediaId={selectedMedia.id} 
                    mediaType={selectedMedia.type}
                    onBack={() => setCurrentView('home')}
                    onNavigateToMedia={handleMediaClick}
                    onGenreClick={handleGenreClick}
                />
            ) : null;
        case 'genre':
            return selectedGenre ? (
                <GenrePage 
                    genre={selectedGenre.genre}
                    type={selectedGenre.type}
                    onBack={() => setCurrentView('home')}
                    onMediaClick={handleMediaClick}
                />
            ) : null;
        case 'home':
        default:
            return (
                <HomePage 
                    onMediaClick={handleMediaClick} 
                    onGenreClick={handleGenreClick}
                    searchResults={searchResults} 
                />
            );
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans">
      <Navbar 
        onSearch={handleSearch} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigate={handleNavigation}
      />

      <main>
        {renderContent()}
      </main>

      {/* Global AI Assistant on Home/Profile */}
      {currentView !== 'details' && currentView !== 'login' && <GeminiAssistant />}

      {/* Footer */}
      <footer className="bg-filmento-card border-t border-gray-800 text-center py-8 text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4">
             <p className="mb-2">طراحی شده برای عاشقان سینما ❤️</p>
             <p className="text-xs">Filmento © 2024</p>
             <div className="mt-4 flex justify-center gap-4 text-xs opacity-50">
                <span>TMDB API</span>
                <span>Gemini AI</span>
                <span>React</span>
             </div>
        </div>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-filmento-yellow mb-6 flex items-center gap-2">
              <Settings size={24} />
              تنظیمات
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">کلید API سایت TMDB</label>
                <input 
                  type="text" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 text-white rounded p-3 text-sm focus:border-filmento-yellow focus:outline-none font-mono text-left"
                  dir="ltr"
                  placeholder="v3 API Key..."
                />
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  برای دریافت اطلاعات واقعی فیلم‌ها، نیاز به کلید API دارید. می‌توانید از 
                  <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="text-filmento-yellow hover:underline mx-1">
                    وبسایت TMDB
                  </a> 
                  دریافت کنید.
                </p>
              </div>

              {!hasKey && (
                <div className="bg-yellow-900/20 border border-yellow-700/50 p-3 rounded flex gap-3 items-start">
                    <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                    <p className="text-xs text-yellow-200/80">
                        بدون کلید API، سایت در حالت "دمو" کار می‌کند و اطلاعات محدودی نمایش می‌دهد.
                    </p>
                </div>
              )}

              <button 
                onClick={saveSettings}
                className="w-full bg-filmento-yellow hover:bg-yellow-500 text-black font-bold py-3 rounded flex items-center justify-center gap-2 transition"
              >
                <Save size={18} />
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Root Component wrapping AuthProvider
function App() {
    return (
        <AuthProvider>
            <FilmentoApp />
        </AuthProvider>
    )
}

export default App;
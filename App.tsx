import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { searchMovies, setTmdbApiKey, getTmdbApiKey } from './services/tmdbService';
import { Movie } from './types';
import { X, Save, AlertTriangle, Settings } from 'lucide-react';
import { GeminiAssistant } from './components/GeminiAssistant';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'details'>('home');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  
  // Settings / API Key Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = getTmdbApiKey();
    if (key) {
      setHasKey(true);
      setApiKeyInput(key);
    } else {
        // Automatically open settings if no key (optional UX choice, kept subtle here)
        // setIsSettingsOpen(true);
    }
  }, []);

  const handleMovieClick = (id: number) => {
    setSelectedMovieId(id);
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedMovieId(null);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setCurrentView('home');
      return;
    }
    const results = await searchMovies(query);
    setSearchResults(results);
    setCurrentView('home'); // Ensure we are on home view to see results
    window.scrollTo(0, 0);
  };

  const saveSettings = () => {
    setTmdbApiKey(apiKeyInput);
    setHasKey(!!apiKeyInput);
    setIsSettingsOpen(false);
    // Reload page to refresh data fetching with new key if needed, or trigger refetch
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans">
      <Navbar 
        onSearch={handleSearch} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main>
        {currentView === 'home' ? (
          <HomePage onMovieClick={handleMovieClick} searchResults={searchResults} />
        ) : (
          <MovieDetailsPage 
            movieId={selectedMovieId!} 
            onBack={handleBackToHome} 
          />
        )}
      </main>

      {/* Global AI Assistant on Home Page (Page specific one is in MovieDetails) */}
      {currentView === 'home' && <GeminiAssistant />}

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
}

export default App;

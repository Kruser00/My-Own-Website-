import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserLists, MediaItem } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  lists: UserLists;
  login: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  toggleWatchlist: (item: MediaItem) => void;
  toggleWatched: (item: MediaItem) => void;
  isInWatchlist: (id: number) => boolean;
  isWatched: (id: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [lists, setLists] = useState<UserLists>({ watchlist: [], watched: [] });

  // Load user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setLists(authService.getUserLists(currentUser.id));
    }
  }, []);

  const login = async (email: string) => {
    const newUser = await authService.loginMock(email);
    setUser(newUser);
    setLists(authService.getUserLists(newUser.id));
  };

  const loginWithGoogle = async () => {
    const newUser = await authService.loginWithGoogleMock();
    setUser(newUser);
    setLists(authService.getUserLists(newUser.id));
  };

  const logout = () => {
    authService.logoutMock();
    setUser(null);
    setLists({ watchlist: [], watched: [] });
  };

  const toggleWatchlist = (item: MediaItem) => {
    if (!user) return; // Should trigger login modal ideally
    const newLists = authService.toggleWatchlist(user.id, item);
    setLists(newLists);
  };

  const toggleWatched = (item: MediaItem) => {
    if (!user) return;
    const newLists = authService.toggleWatched(user.id, item);
    setLists(newLists);
  };

  const isInWatchlist = (id: number) => lists.watchlist.some(i => i.id === id);
  const isWatched = (id: number) => lists.watched.some(i => i.id === id);

  return (
    <AuthContext.Provider value={{ 
      user, lists, login, loginWithGoogle, logout, 
      toggleWatchlist, toggleWatched, isInWatchlist, isWatched 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

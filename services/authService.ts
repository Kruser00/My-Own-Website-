import { User, MediaItem, UserLists } from '../types';

const USERS_KEY = 'filmento_users';
const CURRENT_USER_KEY = 'filmento_current_user';
const LISTS_PREFIX = 'filmento_lists_';

// --- Auth Mock ---

export const loginMock = async (email: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user: User = {
    id: btoa(email), // Simple mock ID
    email,
    name: email.split('@')[0],
    avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=f5c518&color=000`
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const loginWithGoogleMock = async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user: User = {
        id: 'google_user_123',
        email: 'user@gmail.com',
        name: 'کاربر گوگل',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
};

export const logoutMock = async () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

// --- User Lists (Watchlist / Watched) ---

const getListsKey = (userId: string) => `${LISTS_PREFIX}${userId}`;

export const getUserLists = (userId: string): UserLists => {
  const stored = localStorage.getItem(getListsKey(userId));
  if (stored) return JSON.parse(stored);
  return { watchlist: [], watched: [] };
};

const saveUserLists = (userId: string, lists: UserLists) => {
  localStorage.setItem(getListsKey(userId), JSON.stringify(lists));
};

export const toggleWatchlist = (userId: string, item: MediaItem) => {
  const lists = getUserLists(userId);
  const exists = lists.watchlist.some(i => i.id === item.id && i.type === item.type);
  
  if (exists) {
    lists.watchlist = lists.watchlist.filter(i => !(i.id === item.id && i.type === item.type));
  } else {
    lists.watchlist.push(item);
  }
  saveUserLists(userId, lists);
  return lists;
};

export const toggleWatched = (userId: string, item: MediaItem) => {
  const lists = getUserLists(userId);
  const exists = lists.watched.some(i => i.id === item.id && i.type === item.type);
  
  if (exists) {
    lists.watched = lists.watched.filter(i => !(i.id === item.id && i.type === item.type));
  } else {
    // If marking as watched, usually people remove it from watchlist? Let's keep them independent for now or auto-remove.
    // Let's auto-remove from watchlist if it's there
    lists.watchlist = lists.watchlist.filter(i => !(i.id === item.id && i.type === item.type));
    lists.watched.push(item);
  }
  saveUserLists(userId, lists);
  return lists;
};

import { Review, MediaType, User } from '../types';
import { getTmdbReviews } from './tmdbService';

const LOCAL_REVIEWS_PREFIX = 'filmento_reviews_';

const getLocalReviewsKey = (id: number, type: MediaType) => `${LOCAL_REVIEWS_PREFIX}${type}_${id}`;

const getLocalReviews = (id: number, type: MediaType): Review[] => {
    const stored = localStorage.getItem(getLocalReviewsKey(id, type));
    return stored ? JSON.parse(stored) : [];
};

export const getAllReviews = async (id: number, type: MediaType): Promise<Review[]> => {
    // 1. Fetch TMDB Reviews
    const tmdbReviews = await getTmdbReviews(id, type);

    // 2. Fetch Local Reviews
    const localReviews = getLocalReviews(id, type);

    // 3. Merge (Local first)
    return [...localReviews, ...tmdbReviews];
};

export const addReview = (id: number, type: MediaType, user: User, content: string, rating: number) => {
    const key = getLocalReviewsKey(id, type);
    const currentReviews = getLocalReviews(id, type);

    const newReview: Review = {
        id: `local-${Date.now()}`,
        author: user.name,
        avatar: user.avatar || null,
        content,
        rating,
        created_at: new Date().toISOString(),
        source: 'user'
    };

    const updatedReviews = [newReview, ...currentReviews];
    localStorage.setItem(key, JSON.stringify(updatedReviews));
    return updatedReviews;
};

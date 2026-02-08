import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Review, MediaType } from '../types';
import { getAllReviews, addReview } from '../services/reviewService';
import { Star, User as UserIcon, Send } from 'lucide-react';

interface ReviewSectionProps {
    mediaId: number;
    mediaType: MediaType;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ mediaId, mediaType }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(8);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            const data = await getAllReviews(mediaId, mediaType);
            setReviews(data);
            setLoading(false);
        };
        fetchReviews();
    }, [mediaId, mediaType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim()) return;

        setSubmitting(true);
        // Simulate network delay
        setTimeout(() => {
            const updated = addReview(mediaId, mediaType, user, content, rating);
            setReviews(updated); // Local update implies we see our own review first (merged inside addReview return ideally, or refetch)
            // Actually addReview returns the updated list from local storage, we should merge it again with API reviews or just prepend it locally for UI
            // To keep it simple, let's just re-fetch everything or prepend the new one
            // Re-fetching is safer to keep sync logic in service
            getAllReviews(mediaId, mediaType).then(setReviews); 
            
            setContent('');
            setRating(8);
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className="mt-12 max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-filmento-yellow mb-6 border-r-4 border-filmento-yellow pr-3">نظرات کاربران</h2>

            {/* Add Review Form */}
            {user ? (
                <div className="bg-filmento-card border border-gray-700 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-white mb-4">دیدگاه خود را ثبت کنید</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-filmento-yellow h-32 resize-none"
                                placeholder="نظر شما درباره این اثر چیست؟"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm">امتیاز شما:</span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded transition ${rating === num ? 'bg-filmento-yellow text-black font-bold' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="bg-filmento-yellow text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition disabled:opacity-50"
                            >
                                <Send size={18} />
                                {submitting ? 'در حال ثبت...' : 'ارسال نظر'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 text-center">
                    <p className="text-gray-400 mb-2">برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.</p>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="text-center py-8 text-gray-500">در حال بارگذاری نظرات...</div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-900/30 rounded-lg">
                    هنوز نظری ثبت نشده است. اولین نفر باشید!
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {review.avatar ? (
                                        <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                                            <UserIcon size={20} />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white">{review.author}</span>
                                            {review.source === 'user' && (
                                                <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">کاربر فیلمنتو</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString('fa-IR')}</span>
                                    </div>
                                </div>
                                {review.rating && (
                                    <div className="flex items-center gap-1 text-filmento-yellow bg-yellow-900/20 px-2 py-1 rounded-full border border-yellow-900/50">
                                        <Star size={14} fill="currentColor" />
                                        <span className="font-bold text-sm">{review.rating}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line" dir="auto">
                                {review.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface VideoModalProps {
  videoKey: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoKey, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
        {/* Header/Close */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
            <a 
                href={`https://www.youtube.com/watch?v=${videoKey}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-black/50 hover:bg-filmento-yellow hover:text-black text-white p-2 rounded-full transition flex items-center gap-2"
                title="مشاهده در یوتیوب"
            >
                <span className="hidden sm:inline text-sm font-bold px-1">تماشا در یوتیوب</span>
                <ExternalLink size={20} />
            </a>
            <button 
                onClick={onClose}
                className="bg-black/50 hover:bg-filmento-yellow hover:text-black text-white p-2 rounded-full transition"
            >
                <X size={24} />
            </button>
        </div>
        
        <div className="aspect-video w-full bg-black">
            <iframe
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                title="YouTube Video Player"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
      </div>
    </div>
  );
};
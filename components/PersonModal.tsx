import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Person, MediaType } from '../types';
import { getPersonDetails, getImageUrl } from '../services/tmdbService';
import { MediaCard } from './MovieCard';

interface PersonModalProps {
  personId: number;
  onClose: () => void;
  onMediaClick: (id: number, type: MediaType) => void;
}

export const PersonModal: React.FC<PersonModalProps> = ({ personId, onClose, onMediaClick }) => {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      const data = await getPersonDetails(personId);
      setPerson(data);
      setLoading(false);
    };
    fetchPerson();
  }, [personId]);

  const handleMediaClickInternal = (id: number, type: MediaType) => {
      onClose();
      onMediaClick(id, type);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-filmento-card border border-gray-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-filmento-yellow hover:text-black text-white p-2 rounded-full transition"
        >
          <X size={24} />
        </button>

        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <Loader2 className="animate-spin text-filmento-yellow" size={48} />
           </div>
        ) : person ? (
           <div className="flex-1 overflow-y-auto">
             <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/3 p-6 flex flex-col items-center bg-gray-900/50">
                   <div className="w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-xl border-4 border-gray-800 mb-4">
                      <img 
                        src={getImageUrl(person.profile_path)} 
                        alt={person.name} 
                        className="w-full h-full object-cover"
                      />
                   </div>
                   <h2 className="text-2xl font-bold text-center mb-1">{person.name}</h2>
                   <p className="text-filmento-yellow text-sm mb-4">{person.known_for_department}</p>
                   
                   <div className="w-full space-y-2 text-sm text-gray-400">
                      {person.birthday && (
                          <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>{person.birthday}</span>
                          </div>
                      )}
                      {person.place_of_birth && (
                          <div className="flex items-center gap-2">
                              <MapPin size={16} />
                              <span>{person.place_of_birth}</span>
                          </div>
                      )}
                   </div>
                </div>

                {/* Info & Credits Section */}
                <div className="w-full md:w-2/3 p-6">
                    {/* Biography */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-3 border-r-4 border-filmento-yellow pr-3">بیوگرافی</h3>
                        <p className="text-gray-300 text-sm leading-relaxed text-justify max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {person.biography || "بیوگرافی برای این بازیگر ثبت نشده است."}
                        </p>
                    </div>

                    {/* Known For */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-filmento-yellow pr-3">آثار برتر</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {person.combined_credits.cast.map(credit => (
                                <MediaCard 
                                    key={`${credit.type}-${credit.id}`} 
                                    item={credit} 
                                    onClick={handleMediaClickInternal} 
                                />
                            ))}
                        </div>
                        {person.combined_credits.cast.length === 0 && (
                            <p className="text-gray-500">اثری یافت نشد.</p>
                        )}
                    </div>
                </div>
             </div>
           </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
                اطلاعات یافت نشد.
            </div>
        )}
      </div>
    </div>
  );
};

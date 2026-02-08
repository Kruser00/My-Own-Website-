import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Chrome, ArrowLeft, Lock } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await login(email);
    setLoading(false);
    onLoginSuccess();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-filmento-card border border-gray-800 p-8 rounded-2xl w-full max-w-md relative overflow-hidden">
         {/* Decorative Blur */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-filmento-yellow/10 blur-[100px] -z-10 rounded-full" />

         <button onClick={onBack} className="absolute top-6 left-6 text-gray-500 hover:text-white">
            <ArrowLeft size={24} />
         </button>

         <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">خوش آمدید</h1>
            <p className="text-gray-400">برای همگام‌سازی لیست‌ها وارد شوید</p>
         </div>

         <div className="space-y-4">
            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-70"
            >
                {loading ? "..." : <><Chrome size={20} /> ورود با گوگل</>}
            </button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-filmento-card text-gray-500">یا</span></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute right-3 top-3.5 text-gray-500" size={20} />
                    <input 
                        type="email" 
                        placeholder="ایمیل شما"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:ring-2 focus:ring-filmento-yellow focus:outline-none"
                    />
                </div>
                 <div className="relative">
                    <Lock className="absolute right-3 top-3.5 text-gray-500" size={20} />
                    <input 
                        type="password" 
                        placeholder="رمز عبور (نمایشی)"
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:ring-2 focus:ring-filmento-yellow focus:outline-none"
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-filmento-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition disabled:opacity-70"
                >
                    {loading ? "در حال ورود..." : "ورود با ایمیل"}
                </button>
            </form>
         </div>
      </div>
    </div>
  );
};

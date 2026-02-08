import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, Loader2 } from 'lucide-react';
import { generateGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface GeminiAssistantProps {
  context?: string;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'سلام! من هوش مصنوعی فیلمنتو هستم. چطور می‌تونم کمکت کنم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateGeminiResponse(userMessage.text, context);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-40 bg-gradient-to-r from-filmento-yellow to-yellow-600 text-black p-4 rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-110 flex items-center gap-2 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={24} />
        <span className="font-bold hidden md:block">دستیار هوشمند</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[90vw] md:w-[380px] h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-filmento-yellow to-yellow-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-black">
              <Bot size={24} />
              <h3 className="font-bold">هوش مصنوعی فیلمنتو</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-black hover:bg-black/10 p-1 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gray-700 text-white rounded-br-none'
                      : 'bg-filmento-yellow/90 text-black rounded-bl-none font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-filmento-yellow/20 p-2 rounded-2xl rounded-bl-none">
                  <Loader2 className="animate-spin text-filmento-yellow" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="سوال خود را بپرسید..."
                className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-filmento-yellow/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-filmento-yellow text-black rounded-full hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

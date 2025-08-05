
import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 border-t border-orange-500/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 p-3 bg-gray-700 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
                autoComplete="off"
            />
            <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-orange-600 text-white p-3 rounded-full hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300 flex-shrink-0"
                aria-label="Enviar mensaje"
            >
                <SendIcon />
            </button>
        </form>
    </div>
  );
};

export default ChatInput;

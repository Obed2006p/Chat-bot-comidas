import React from 'react';
import { WhatsAppIcon } from './Icons';

const Header: React.FC = () => {
  const handleShare = () => {
    // This code runs only in the browser, so `window` is safe to use.
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      const message = `¡Hola! Te comparto este increíble chatbot para pedir comida de 'El Sabor Digital'. ¡Pruébalo aquí!: ${url}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-orange-500/30 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            El Sabor Digital
          </h1>
          <p className="text-sm text-orange-400">Asistente de Pedidos</p>
        </div>
        
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3 py-2 bg-green-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
          aria-label="Compartir en WhatsApp"
        >
          <WhatsAppIcon />
          <span className="hidden sm:inline">Compartir</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
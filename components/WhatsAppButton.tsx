
import React from 'react';
import { WhatsAppIcon } from './Icons';

interface WhatsAppButtonProps {
    orderText: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ orderText }) => {
    // TODO: Reemplaza este número con el número de WhatsApp de tu restaurante.
    // Incluye el código de país, sin '+' ni espacios. Por ejemplo: '523148721913'.
    const aphoneNumber = '523148721913';
    const message = `¡Hola! Quisiera confirmar mi pedido:\n\n${orderText}`;
    const whatsappUrl = `https://wa.me/${aphoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-3 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
            aria-label="Confirmar Pedido por WhatsApp"
        >
            <WhatsAppIcon />
            <span>Confirmar Pedido por WhatsApp</span>
        </a>
    );
};

export default WhatsAppButton;

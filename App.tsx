import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Sender } from './types';
import { sendMessage as sendBotMessage } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

// Un componente dedicado para mostrar el error de la API key. Esto ofrece una
// mejor experiencia de usuario que mostrar el error dentro de una burbuja de chat.
const ApiKeyError: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 -mt-20">
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-orange-500/50 max-w-md w-full">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mt-4 text-2xl font-bold text-white">Configuración Requerida</h2>
      <p className="mt-2 text-gray-300">
        La API Key de Gemini no está configurada.
      </p>
      <p className="mt-4 text-sm text-gray-400">
        Para que el chatbot funcione, por favor, define el secreto <code className="bg-gray-900 text-orange-400 px-1 py-0.5 rounded text-xs font-mono">API_KEY</code> en tu plataforma de despliegue.
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  // Este efecto se ejecuta una vez al montar para verificar la API key.
  useEffect(() => {
    const key = process.env.API_KEY;
    if (key && key.length > 0) {
      setHasApiKey(true);
    } else {
      console.error("La variable de entorno API_KEY no fue encontrada.");
    }
  }, []);

  const sendInitialMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const initialUserMessage = "Hola";
      const response = await sendBotMessage(initialUserMessage);

      const botMessage: Message = {
        id: uuidv4(),
        text: response.text,
        sender: Sender.Bot,
      };
      setMessages([botMessage]);
    } catch (error) {
      console.error('Error sending initial message to Gemini:', error);
      const errorMessageText = error instanceof Error ? error.message : 'Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo de nuevo más tarde.';
      const errorMessage: Message = {
        id: uuidv4(),
        text: errorMessageText,
        sender: Sender.Bot,
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Este efecto dispara el mensaje inicial una vez que se confirma la API key.
  useEffect(() => {
    if (hasApiKey && messages.length === 0) {
      sendInitialMessage();
    }
  }, [hasApiKey, messages.length, sendInitialMessage]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = { id: uuidv4(), text, sender: Sender.User };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendBotMessage(text);
      const botMessage: Message = {
        id: uuidv4(),
        text: response.text,
        sender: Sender.Bot,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
       const errorMessageText = error instanceof Error ? error.message : 'Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.';
      const errorMessage: Message = {
        id: uuidv4(),
        text: errorMessageText,
        sender: Sender.Bot,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-main-pattern font-sans">
      <Header />
      <main className="flex-1 flex flex-col pt-20"> 
        {hasApiKey ? (
          <>
            <div className="flex-1 flex flex-col min-h-0">
              <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
                <ChatWindow messages={messages} isLoading={isLoading} />
              </div>
            </div>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        ) : (
          <ApiKeyError />
        )}
      </main>
    </div>
  );
};

export default App;
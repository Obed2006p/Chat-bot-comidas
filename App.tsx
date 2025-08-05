import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Sender } from './types';
import { sendMessage as sendBotMessage } from './services/geminiService';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  useEffect(() => {
    // Evita enviar el mensaje inicial dos veces en StrictMode
    if (messages.length === 0) {
      sendInitialMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
            <ChatWindow messages={messages} isLoading={isLoading} />
          </div>
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;

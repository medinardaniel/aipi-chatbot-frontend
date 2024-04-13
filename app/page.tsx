'use client';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import './styles/page.css';

type Message = {
  text: string;
  sender: 'user' | 'system';
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = async (message: string) => {
    if (!message) return;
  
    // Add the user message to the state
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
  
    try {
      // Call the backend API route to get the embedding
      console.log('message', message)
      const response = await fetch('/embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const embedding = await response.json();
      
      // You can now use the embedding for further processing or store it
      console.log(embedding);
  
      // Here you can set the system's response based on the embedding
      setMessages((prevMessages) => [...prevMessages, { text: "System response based on embedding", sender: 'system' }]);
  
    } catch (error) {
      console.error('Failed to fetch embedding:', error);
      // Handle the error state appropriately in the UI
    }
  };

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleClick = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <main className="main"> {/* Changed to match component name */}
      <div className="main-content-container">
        <div className="chat-interface">
          <div className="chat-window">
            {messages.map((message, index) => (
              <div key={index} className={`message-container ${message.sender === 'user' ? 'text-right' : ''}`}>
                <span className="message">
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="input-container">
            <textarea
              className="input-form"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
            />
            <button
              className="submit-button"
              onClick={handleClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


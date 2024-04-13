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

  const sendMessage = (message: string) => {
    if (!message) return;
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'user' }]);
    // Simulate a response from the system
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: "System response", sender: 'system' }]);
    }, 500);
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


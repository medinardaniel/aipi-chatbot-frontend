'use client';
// Importing necessary React modules and CSS
import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import './styles/page.css';

// Define a type for messages
interface Message {
  text: string;
  sender: 'user' | 'system';
};

const Home: React.FC = () => {
  // State hooks for messages and input value
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const chatWindowRef = useRef<HTMLDivElement>(null);  // Reference for the chat window div
  const [isLoading, setIsLoading] = useState(false);

  // Effect for scrolling the chat window to the latest message
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send message to the server
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;  // Ignore empty messages

    // Clear the input right after validating the message is not empty
    setInputValue('');  // Clear the input immediately

    // Add user message to the state
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);

    // Show loading spinner with robot image as a system message
    const loadingMessage: Message = { text: "loading", sender: 'system' };
    setMessages(prevMessages => [...prevMessages, loadingMessage]);

    setIsLoading(true);  // Start loading indication

    try {
        const response = await fetch('http://127.0.0.1:5000/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        // Remove loading message and add actual response
        setMessages(prevMessages => prevMessages.filter(msg => msg.text !== "loading").concat({ text: responseData || "No response generated", sender: 'system' }));
    } catch (error) {
        console.error('Failed to fetch response:', error);
        // Remove loading message and show error
        setMessages(prevMessages => prevMessages.filter(msg => msg.text !== "loading").concat({ text: "Failed to connect to the server", sender: 'system' }));
    } finally {
        setIsLoading(false);  // Stop loading indication
    }
};

  // Handler for input changes
  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  // Handler for key presses in textarea
  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Handler for click on the send button
  const handleClick = () => {
    sendMessage(inputValue);
  };

  return (
    <>
      <div className="left-side">
        <h1 className="title">Duke University</h1>
        <p className="subtitle">Artificial Intelligence Masters of Engineering</p>
        {/* <p className="description-title">Important dates & Information</p>
        <ul className="description">
          <li>Program website: https://ai.meng.duke.edu/degree</li>
          <li>Program director: Jon Reifschneider (jreif@duke.edu).</li>
          <li>Application deadline: January 15.</li>
          <li>Admission decisions: Mid March.</li>
        </ul> */}
      </div>
      <main className="main">
        <div className="main-content-container">
          <div className="chat-interface">
          <div className="chat-window" ref={chatWindowRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message-container ${message.sender === 'user' ? 'user-message' : 'system-message'}`}>
              {message.sender === 'system' && message.text === "loading" ? (
                <div className="loading-container">
                  <img src="robot-blue.svg" alt="Processing..." className="robot-icon"/>
                  <div className="loading-dots">
                    <div></div><div></div><div></div>
                  </div>
                </div>
              ) : (
                <>
                  {message.sender === 'system' && <img src="robot-blue.svg" alt="Robot" className="robot-icon" />}
                  <span className="message">{message.text}</span>
                </>
              )}
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
                className={`submit-button ${isLoading ? 'disabled' : ''}`}
                onClick={handleClick}
                disabled={isLoading}  // Button is disabled when isLoading is true
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

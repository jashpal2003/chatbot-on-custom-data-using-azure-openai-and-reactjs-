import { useState } from 'react';
import './App.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const apiUrl = 'your api endpoint ';
  const apikey = 'enter your api key ';
  let cont = `provide content here from where you want to fetch the answer`;

  const addMessage = (text, role) => {
    const newMessage = { text, role };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleUserInput = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const requestBody = {
      messages: [
        { role: 'system', content: `you are assistant of ***** . you give answer according to the following content ${cont}` },
        { role: 'user', content: inputText },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    };

    addMessage(inputText, 'user');
    setInputText('');

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'api-key': apikey,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const assistantReply = responseData.choices[0]?.message.content;
      addMessage(assistantReply, 'assistant');

    } catch (error) {
      console.error('Error:', error);
      addMessage('There was an error while sending the message. Please try again later.', 'assistant');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className='container'>
      <div className="header">
        <h2>DesireInfoWeb - AI Chat Assistant</h2>
      </div>
      <div className='chat-app'>
        <div className='chat-window'>
          {
            messages.map((msg, index) => (
              <div key={index} className={msg.role === 'user' ? 'user-message' : 'assistant-message'}>
                {msg.text}
              </div>
            ))
          }
        </div>

        <div className='input-container'>
          <input
            type="text"
            value={inputText}
            onChange={handleUserInput}
            placeholder='Type your message...'
          />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={handleClearChat}>Clear</button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;

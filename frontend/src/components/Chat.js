import React from 'react';
import Chatbot from './Chatbot';

const Chat = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Literature Bot</h1>
      <Chatbot />
    </div>
  );
};

export default Chat;

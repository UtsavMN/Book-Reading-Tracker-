import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!message || loading) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/bot', { message }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChat([...chat, { user: message, bot: res.data.response }]);
      setMessage('');
    } catch (error) {
      console.error(error);
      setError('Failed to send message. Please check if the server is running and you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <h2>Literature Bot</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
        {chat.length === 0 && <p>Welcome! Ask me about literature.</p>}
        {chat.map((c, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <p><strong>You:</strong> {c.user}</p>
            <p><strong>Bot:</strong> {c.bot}</p>
          </div>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask about literature..."
        disabled={loading}
        style={{ width: '70%', marginRight: '10px' }}
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default Chatbot;

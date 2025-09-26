import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Books from './components/Books';
import Progress from './components/Progress';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {token ? (
              <>
                <li><Link to="/books">Books</Link></li>
                <li><Link to="/progress">Progress</Link></li>
                <li><Link to="/chat">Chat</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={token ? <Books /> : <Login />} />
          <Route path="/progress" element={token ? <Progress /> : <Login />} />
          <Route path="/chat" element={token ? <Chat /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressTracker = () => {
  const [progress, setProgress] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [progressRes, booksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/progress', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/books', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProgress(progressRes.data);
        setBooks(booksRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/progress', {
        book: selectedBook,
        currentPage: parseInt(currentPage)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setProgress([...progress, res.data]);
      setSelectedBook('');
      setCurrentPage('');
    } catch (error) {
      console.error(error);
    }
  };

  const updateProgressItem = async (progressId, updates) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/progress/${progressId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data
      const fetchData = async () => {
        const [progressRes, booksRes] = await Promise.all([
          axios.get('http://localhost:5000/api/progress', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/books', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setProgress(progressRes.data);
        setBooks(booksRes.data);
      };
      fetchData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Prepare data for chart
  const chartData = progress.map(p => ({
    book: p.book.title,
    pagesRead: p.currentPage,
    totalPages: p.book.totalPages || 100,
    percentage: ((p.currentPage / (p.book.totalPages || 100)) * 100).toFixed(2)
  }));

  return (
    <div>
      <h2>Reading Progress</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required>
          <option value="">Select Book</option>
          {books.map(book => (
            <option key={book._id} value={book._id}>{book.title}</option>
          ))}
        </select>
        <input type="number" value={currentPage} onChange={(e) => setCurrentPage(e.target.value)} placeholder="Current Page" required />
        <button type="submit">Update Progress</button>
      </form>
      <div>
        {progress.map(p => (
          <div key={p._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h3>{p.book.title} by {p.book.author}</h3>
            <p>Current Page: {p.currentPage} / {p.book.totalPages || 'N/A'}</p>
            <p>Progress: {((p.currentPage / (p.book.totalPages || 100)) * 100).toFixed(2)}%</p>
            <p>Status: 
              <select
                value={p.status}
                onChange={(e) => updateProgressItem(p._id, { status: e.target.value })}
              >
                <option value="Not Started">Not Started</option>
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </p>
            <p>Start Date: {p.startDate ? new Date(p.startDate).toLocaleDateString() : 'Not set'}</p>
            <p>End Date: {p.endDate ? new Date(p.endDate).toLocaleDateString() : 'Not set'}</p>
            <button onClick={() => updateProgressItem(p._id, { currentPage: p.currentPage + 1 })}>
              Mark Next Page
            </button>
          </div>
        ))}
      </div>
      {chartData.length > 0 && (
        <div style={{ height: 300, marginTop: '20px' }}>
          <h3>Progress Overview Chart</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="book" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pagesRead" fill="#8884d8" name="Pages Read" />
              <Bar dataKey="totalPages" fill="#82ca9d" name="Total Pages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

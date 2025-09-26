import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    readingBooks: 0,
    notStartedBooks: 0,
    totalPagesRead: 0,
    averageProgress: 0
  });
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [booksRes, progressRes] = await Promise.all([
          axios.get('http://localhost:5000/api/books', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/progress', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const books = booksRes.data;
        const progress = progressRes.data;

        const totalBooks = books.length;
        const completedBooks = progress.filter(p => p.status === 'Completed').length;
        const readingBooks = progress.filter(p => p.status === 'Reading').length;
        const notStartedBooks = progress.filter(p => p.status === 'Not Started').length;
        const totalPagesRead = progress.reduce((sum, p) => sum + p.currentPage, 0);
        const averageProgress = progress.length > 0 ? (progress.reduce((sum, p) => sum + (p.currentPage / (p.book.totalPages || 100)) * 100, 0) / progress.length).toFixed(2) : 0;

        setStats({
          totalBooks,
          completedBooks,
          readingBooks,
          notStartedBooks,
          totalPagesRead,
          averageProgress
        });

        // Prepare data for charts
        const chartData = progress.map(p => ({
          book: p.book.title,
          progress: ((p.currentPage / (p.book.totalPages || 100)) * 100).toFixed(2),
          status: p.status
        }));
        setProgressData(chartData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Completed', value: stats.completedBooks, color: '#00C49F' },
    { name: 'Reading', value: stats.readingBooks, color: '#FFBB28' },
    { name: 'Not Started', value: stats.notStartedBooks, color: '#FF8042' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Reading Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
          <h3>Total Books</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.totalBooks}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
          <h3>Completed Books</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#00C49F' }}>{stats.completedBooks}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
          <h3>Currently Reading</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#FFBB28' }}>{stats.readingBooks}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
          <h3>Total Pages Read</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.totalPagesRead}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', minWidth: '200px' }}>
          <h3>Average Progress</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{stats.averageProgress}%</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ width: '400px', height: '300px' }}>
          <h3>Reading Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '600px', height: '300px' }}>
          <h3>Book Progress</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="book" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#8884d8" name="Progress (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

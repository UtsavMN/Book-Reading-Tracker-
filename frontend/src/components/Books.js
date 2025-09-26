import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookList from './BookList';
import BookForm from './BookForm';

const Books = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onAdd = (newBook) => {
    setBooks([...books, newBook]);
  };

  return (
    <div>
      <h1>Books</h1>
      <BookForm onAdd={onAdd} />
      <BookList books={books} />
    </div>
  );
};

export default Books;

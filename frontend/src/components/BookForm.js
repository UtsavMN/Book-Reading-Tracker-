import React, { useState } from 'react';
import axios from 'axios';

const BookForm = ({ onAdd }) => {
  const [form, setForm] = useState({ title: '', author: '', description: '', totalPages: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/books', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAdd(res.data);
      setForm({ title: '', author: '', description: '', totalPages: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <input name="totalPages" value={form.totalPages} onChange={handleChange} placeholder="Total Pages" type="number" />
      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;

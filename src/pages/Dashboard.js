import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../services/bookService';
import BookList from '../components/BookList';
import CompletedBooks from '../components/CompletedBooks';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await getBooks();
      setBooks(books);
      setCompletedBooks(books.filter(book => book.completed));
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/add-book">Add Book</Link>
      <BookList books={books} />
      <CompletedBooks books={completedBooks} />
    </div>
  );
};

export default Dashboard;
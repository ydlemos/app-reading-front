import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import BookCard from './BookCard';
import { apiMethods } from '../utils/api';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import Modal from './Modal'; // Import the Modal component

function CompletedBooks() {
  const [completedBooks, setCompletedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Track the selected book for editing
  const [bookToDelete, setBookToDelete] = useState(null); // Track the book to delete

  useEffect(() => {
    const fetchCompletedBooks = async () => {
      try {
        const booksResponse = await apiMethods.getBooks();
        const completed = booksResponse.data.filter(book => book.pagesRead === book.totalPages);
        setCompletedBooks(completed);
      } catch (error) {
        console.error('Erreur lors de la récupération des livres terminés:', error);
      }
    };

    fetchCompletedBooks();
  }, []);

  
  const openModal = (modalId) => {
    if (window.M) {
      const modalElement = document.querySelector(modalId);
      const instance = window.M.Modal.getInstance(modalElement);
      if (instance) {
        instance.open();
      } else {
        console.error(`Modal with ID ${modalId} not found.`);
      }
    }
  };

  const closeModal = (modalId) => {
    if (window.M) {
      const modalElement = document.querySelector(modalId);
      const instance = window.M.Modal.getInstance(modalElement);
      if (instance) {
        instance.close();
      } else {
        console.error(`Modal with ID ${modalId} not found.`);
      }
    }
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    openModal('#editBookModal');
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    openModal('#deleteBookModal');
  };

  const handleDeleteConfirm = () => {
      if (bookToDelete) {
        apiMethods.deleteBook(bookToDelete.id) // Assume this API method exists
          .then(async () => {
            setCompletedBooks(completedBooks.filter(book => book.id !== bookToDelete.id));
            setBookToDelete(null);
            closeModal('#deleteBookModal');
          })
          .catch(error => {
            console.error('Erreur lors de la suppression du livre:', error);
          });
      }
    };
  
    const handleDeleteCancel = () => {
      setBookToDelete(null);
      closeModal('#deleteBookModal');
    };

  const handleEditConfirm = (updatedBook) => {
    apiMethods.updateBook(updatedBook.id, updatedBook) // Assume this API method exists
      .then(() => {
        setCompletedBooks(completedBooks.map(book => book.id === updatedBook.id ? updatedBook : book));
        setSelectedBook(null);
        closeModal('#editBookModal');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du livre:', error);
      });
  };

  const handleEditCancel = () => {
    setSelectedBook(null);
    closeModal('#editBookModal');
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ width: '100%' }}>
        <h2 className="section">Livres Terminés</h2>
        <div className="row">
          {completedBooks.length > 0 ? (
            completedBooks.map((book) => {
              const progress = book.totalPages ? (book.pagesRead / book.totalPages) * 100 : 0;
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  progress={progress}
                  onEditClick={handleEditClick} // Include edit action
                  onDeleteClick={handleDeleteClick} // Include delete action
                />
              );
            })
          ) : (
            <p className="center-align">Aucun livre terminé pour le moment.</p>
          )}
        </div>
        <Modal
          id="deleteBookModal"
          title="Confirmer la suppression"
          onSave={handleDeleteConfirm}
          onClose={handleDeleteCancel}
          saveLabel="Supprimer"
          closeLabel="Annuler"
        >
          {bookToDelete && (
            <p>Êtes-vous sûr de vouloir supprimer le livre "{bookToDelete.title}" ?</p>
          )}
        </Modal>
        <Modal
          id="editBookModal"
          title="Modifier le livre"
          onSave={() => handleEditConfirm(selectedBook)}
          onClose={handleEditCancel}
          saveLabel="Enregistrer"
          closeLabel="Annuler"
        >
          {selectedBook && (
            <div>
              <label htmlFor="bookTitle">Titre</label>
              <input
                id="bookTitle"
                type="text"
                value={selectedBook.title}
                onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
              />
              <label htmlFor="bookAuthor">Auteur</label>
              <input
                id="bookAuthor"
                type="text"
                value={selectedBook.author}
                onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
              />
              <label htmlFor="bookPagesRead">Pages lues</label>
              <input
                id="bookPagesRead"
                type="number"
                value={selectedBook.pagesRead}
                onChange={(e) => setSelectedBook({ ...selectedBook, pagesRead: parseInt(e.target.value, 10) })}
              />
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}

export default CompletedBooks;

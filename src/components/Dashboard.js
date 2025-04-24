import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; // Import Navbar component
import BookCard from './BookCard'; // Import BookCard component
import { apiMethods } from '../utils/api';
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import Modal from './Modal'; // Import Modal component

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Track the selected book for editing
  const [newBook, setNewBook] = useState({ title: '', author: '', totalPages: '', category: '', pagesRead: '', imageUrl: '' }); // Updated new book state
  const { checkAuth, isAuthenticated } = useAuth(); // Use AuthContext
  const [bookToDelete, setBookToDelete] = useState(null); // Track the book to delete
  const [userXp, setUserXp] = useState(0); // Track user XP
  const [userLevel, setUserLevel] = useState(0); // Track user level
  const [userBadges, setUserBadges] = useState([]); // Track user badges
  const [badgesCollapsed, setBadgesCollapsed] = useState(false); // State to track collapse status
  const [errors, setErrors] = useState({}); // State to track validation errors

  const fetchAndUpdateUserLevelAndXp = async () => {
    try {
      const response = await apiMethods.getUserLevelAndXp(); // Fetch user level and XP
      setUserXp(response.data.xpPoints); // Update XP
      setUserLevel(response.data.level); // Update level
    } catch (error) {
      console.error('Erreur lors de la récupération des points d\'XP et du niveau:', error);
    }
  };

  const fetchUserBadges = async () => {
    try {
      const response = await apiMethods.getUserBadges(); // Assume this API method exists
      setUserBadges(response.data.badges); // Update badges
    } catch (error) {
      console.error('Erreur lors de la récupération des badges:', error);
    }
  };

  const initializeModals = () => {
    if (window.M) {
      const modals = document.querySelectorAll('.modal');
      window.M.Modal.init(modals, {
        onCloseEnd: () => setErrors({}) // Clear errors when modal is closed
      });
    } else {
      console.error('MaterializeCSS is not loaded.');
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if the user is authenticated
        await checkAuth();
        if (isAuthenticated) {
          // Fetch books
          const booksResponse = await apiMethods.getBooks();
            setBooks(booksResponse.data
            .filter(book => !book.isCompleted) // Exclude completed books based on isCompleted property
            .map(book => ({
              ...book,
              imageUrl: book.imageUrl || 'https://www.senscritique.com/missingPicture/product/album.jpg' // Ensure imageUrl is included
            }))
            );

          await fetchAndUpdateUserLevelAndXp(); // Fetch and update user level and XP
          await fetchUserBadges(); // Fetch user badges
        }
  
        // Revalidate authentication if stored in localStorage
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
          await checkAuth();
        }
  
        // Initialize Materialize modals
        initializeModals(); // Initialize modals with error clearing
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du tableau de bord:', error);
      }
    };

    initializeDashboard();
  }, [checkAuth, isAuthenticated]);

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

  const handleModalClose = () => {
    setSelectedBook(null);
    closeModal('#editBookModal');
  };

  const validateNewBook = () => {
    const newErrors = {};
    if (!newBook.title.trim()) newErrors.title = 'Le titre ne doit pas être vide.';
    if (!newBook.author.trim()) newErrors.author = 'L\'auteur ne doit pas être vide.';
    if (newBook.pagesRead > newBook.totalPages) newErrors.pagesRead = 'Les pages lues ne peuvent pas dépasser le nombre total de pages.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSelectedBook = () => {
    const newErrors = {};
    if (!selectedBook.title.trim()) newErrors.title = 'Le titre ne doit pas être vide.';
    if (!selectedBook.author.trim()) newErrors.author = 'L\'auteur ne doit pas être vide.';
    if (selectedBook.pagesRead > selectedBook.totalPages) newErrors.pagesRead = 'Les pages lues ne peuvent pas dépasser le nombre total de pages.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateSelectedBook()) return;

    apiMethods.updateBook(selectedBook.id, selectedBook)
      .then(async () => {
        setBooks(books.map(book => (book.id === selectedBook.id ? selectedBook : book)));
        setSelectedBook(null); // Clear the selected book
        await fetchAndUpdateUserLevelAndXp(); // Fetch and update user level and XP
        closeModal('#editBookModal');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du livre:', error);
      });
  };

  const handleAddBookClick = () => {
    openModal('#addBookModal');
  };

  const handleAddModalClose = () => {
    setNewBook({ title: '', author: '', totalPages: '', category: '', pagesRead: '', imageUrl: '' }); // Clear errors
    closeModal('#addBookModal');
  };

  const handleAddBookSave = () => {
    if (!validateNewBook()) return;

    apiMethods.addBook(newBook)
      .then(async (response) => {
        setBooks([...books, response.data]);
        setNewBook({ title: '', author: '', totalPages: '', category: '', pagesRead: '', imageUrl: '' });
        await fetchAndUpdateUserLevelAndXp(); // Fetch and update user level and XP
        closeModal('#addBookModal');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du livre:', error);
      });
  };

  const handleMarkAsRead = (bookId) => {
    apiMethods.markAsRead(bookId) // Assume this API method exists
      .then(async () => {
        setBooks(books.map(book =>
          book.id === bookId ? { ...book, pagesRead: book.totalPages } : book
        ));
        await fetchAndUpdateUserLevelAndXp(); // Fetch and update user level and XP
        await fetchUserBadges(); // Fetch user badges
      })
      .catch(error => {
        console.error('Erreur lors du marquage comme lu:', error);
      });
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    openModal('#deleteBookModal');
  };

  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      apiMethods.deleteBook(bookToDelete.id) // Assume this API method exists
        .then(async () => {
          setBooks(books.filter(book => book.id !== bookToDelete.id));
          await fetchAndUpdateUserLevelAndXp(); // Fetch and update user level and XP
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

  const toggleBadgesCollapse = () => {
    setBadgesCollapsed(!badgesCollapsed);
  };

  return (
    <>
      <Navbar /> 
      <div className="container" style={{ width: '100%' }}> {/* Full-width container */}
        <div className="section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="flow-text user-xp">
            Mes points d'xp: <span className="bold">{userXp} XP</span> | Niveau: <span className="bold">{userLevel}</span>
          </p>
          <button
            className="btn red darken-2 waves-effect waves-light"
            onClick={handleAddBookClick}
          >
            Ajouter un livre
          </button>
        </div>
        <div className="section">
          <button
            className="btn blue darken-2 waves-effect waves-light"
            style={{ width: '100%', maxWidth: '200px', margin: '0 auto', display: 'block' }} // Responsive button
            onClick={toggleBadgesCollapse}
          >
            {badgesCollapsed ? 'Afficher les badges' : 'Réduire les badges'}
          </button>
          <div
            className="badges-container"
            style={{
              overflow: 'hidden', // Ensure content is hidden when collapsed
              transition: 'max-height 0.5s ease', // Smooth transition for max-height
              maxHeight: badgesCollapsed ? '0' : '500px', // Adjust max-height for collapse/expand
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row', // Align badges in a single row
                overflowX: 'auto', // Enable horizontal scrolling
                gap: '20px',
                padding: '10px',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              {userBadges.length > 0 ? (
                userBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="badge"
                    style={{
                      textAlign: 'center',
                      flex: '0 0 auto', // Prevent badges from shrinking
                      margin: '10px',
                    }}
                  >
                    <img
                      src="trophy.png"
                      alt={badge.title}
                      style={{
                        width: '50px',
                        height: '50px',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                    <p style={{ fontSize: '1.8rem', margin: '0', fontWeight: 'bold', fontFamily: 'Caveat'  }}>{badge.title}</p>
                    <p style={{ fontSize: '1.3rem', margin: '0', fontStyle: 'italic', fontFamily: 'Caveat' }}>{badge.criteria}</p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center' }}>Aucun badge pour le moment.</p>
              )}
            </div>
          </div>
        </div>
        <h2 className="section">Livres en attente de lecture</h2>
        <div className="row">
          {books.length > 0 ? (
            books.map((book) => {
              const progress = book.totalPages ? (book.pagesRead / book.totalPages) * 100 : 0;
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  progress={progress}
                  onEditClick={handleEditClick}
                  onMarkAsRead={handleMarkAsRead}
                  onDeleteClick={handleDeleteClick}
                />
              );
            })
          ) : (
            <p className="center-align">Aucun livre en cours de lecture pour le moment.</p>
          )}
        </div>

        <Modal
          id="addBookModal"
          title="Ajouter un Livre"
          onSave={handleAddBookSave}
          onClose={handleAddModalClose}
        >
          <div className="input-field">
            <input
              id="title"
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
            />
            <label htmlFor="title">Titre</label>
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>
          <div className="input-field">
            <input
              id="author"
              type="text"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
            />
            <label htmlFor="author">Auteur</label>
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>
          <div className="input-field">
            <input
              id="totalPages"
              type="number"
              value={newBook.totalPages}
              onChange={(e) => setNewBook({ ...newBook, totalPages: parseInt(e.target.value, 10) })}
              min="1"
              required
            />
            <label htmlFor="totalPages">Nombre de Pages</label>
          </div>
          <div className="input-field">
            <input
              id="pagesRead"
              type="number"
              value={newBook.pagesRead}
              onChange={(e) => setNewBook({ ...newBook, pagesRead: parseInt(e.target.value, 10) })}
              min="0"
              max={newBook.totalPages || ''}
              required
            />
            <label htmlFor="pagesRead">Pages lues</label>
            {errors.pagesRead && <span className="error-text">{errors.pagesRead}</span>}
          </div>
          <div className="input-field">
            <input
              id="category"
              type="text"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
            />
            <label htmlFor="category">Catégorie</label>
          </div>
          <div className="input-field">
            <input
              id="imageUrl"
              type="url"
              value={newBook.imageUrl}
              onChange={(e) => setNewBook({ ...newBook, imageUrl: e.target.value })}
            />
            <label htmlFor="imageUrl">URL de l'image</label>
          </div>
        </Modal>

        <Modal
          id="editBookModal"
          title="Modifier le Livre"
          onSave={handleSave}
          onClose={handleModalClose}
        >
          {selectedBook && (
            <>
              <div className="input-field">
                <input
                  id="editTitle"
                  type="text"
                  value={selectedBook.title}
                  onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
                  required
                />
                <label htmlFor="editTitle" className="active">Titre</label>
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>
              <div className="input-field">
                <input
                  id="editAuthor"
                  type="text"
                  value={selectedBook.author}
                  onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
                  required
                />
                <label htmlFor="editAuthor" className="active">Auteur</label>
                {errors.author && <span className="error-text">{errors.author}</span>}
              </div>
              <div className="input-field">
                <input
                  id="editTotalPages"
                  type="number"
                  value={selectedBook.totalPages}
                  onChange={(e) => setSelectedBook({ ...selectedBook, totalPages: parseInt(e.target.value, 10) })}
                  min="1"
                  required
                />
                <label htmlFor="editTotalPages" className="active">Nombre de Pages</label>
              </div>
              <div className="input-field">
                <input
                  id="editPagesRead"
                  type="number"
                  value={selectedBook.pagesRead}
                  onChange={(e) => setSelectedBook({ ...selectedBook, pagesRead: parseInt(e.target.value, 10) })}
                  min="0"
                  max={selectedBook.totalPages || ''}
                  required
                />
                <label htmlFor="editPagesRead" className="active">Pages lues</label>
                {errors.pagesRead && <span className="error-text">{errors.pagesRead}</span>}
              </div>
              <div className="input-field">
                <input
                  id="editCategory"
                  type="text"
                  value={selectedBook.category}
                  onChange={(e) => setSelectedBook({ ...selectedBook, category: e.target.value })}
                />
                <label htmlFor="editCategory" className="active">Catégorie</label>
              </div>
              <div className="input-field">
                <input
                  id="editImageUrl"
                  type="url"
                  value={selectedBook.imageUrl}
                  onChange={(e) => setSelectedBook({ ...selectedBook, imageUrl: e.target.value })}
                />
                <label htmlFor="editImageUrl" className="active">URL de l'image</label>
              </div>
            </>
          )}
        </Modal>

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
      </div>
    </>
  );
}

export default Dashboard;

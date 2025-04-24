import React from 'react';

function BookCard({ book, progress, onEditClick, onDeleteClick, onMarkAsRead }) {
  return (
    <div
      className="col s12 m6 l3 animate__animated animate__fadeIn"
      style={{ animationDuration: '0.5s' }}
    >
      <div className="card" style={{ height: '400px', overflow: 'hidden' }}>
        <div className="card-image">
          <img
            src={book.imageUrl || "https://www.senscritique.com/missingPicture/product/album.jpg"}
            alt={`Cover of ${book.title}`}
            style={{ maxHeight: '150px', objectFit: 'cover' }}
          />
          <span
            className="card-title"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '5px',
              padding: '4px 8px',
              color: 'white',
              display: 'inline-block',
            }}
          >
            {book.category}
          </span>
        </div>
        <div className="card-content" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <h5 className="truncate" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{book.title}</h5>
          <p className="truncate">{book.author}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="progress" style={{ flex: 1 }}>
              <div
                className="determinate"
                style={{ width: `${Math.floor(progress)}%` }}
              ></div>
            </div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{Math.floor(progress)}%</p>
          </div>
          <p className="truncate" style={{ fontSize: '0.8rem', fontStyle: 'oblique', textAlign: 'right' }}>{book.pagesRead}/{book.totalPages} pages</p>
        </div>
        {(onEditClick || onDeleteClick || onMarkAsRead) && (
          <div className="card-action" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {onEditClick && (
              <button
                className="btn-floating blue darken-2 waves-effect waves-light"
                onClick={() => onEditClick(book)}
              >
                <i className="material-icons">edit</i>
              </button>
            )}
            {onMarkAsRead && (
              <button
                className="btn-floating green darken-2 waves-effect waves-light"
                onClick={() => onMarkAsRead(book.id)}
                disabled={book.pagesRead === book.totalPages}
              >
                <i className="material-icons">check</i>
              </button>
            )}
            {onDeleteClick && (
              <button
                className="btn-floating red darken-2 waves-effect waves-light"
                onClick={() => onDeleteClick(book)}
              >
                <i className="material-icons">delete</i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;

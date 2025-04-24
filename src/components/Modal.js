import React, { useEffect } from 'react';

function Modal({ id, title, children, onSave, onClose, saveLabel = 'Enregistrer', closeLabel = 'Annuler' }) {
  useEffect(() => {
    if (window.M) {
      const modalElement = document.querySelector(`#${id}`);
      window.M.Modal.init(modalElement);
    } else {
      console.error('MaterializeCSS is not loaded.');
    }
  }, [id]);

  return (
    <div id={id} className="modal custom-modal">
      <div className="modal-content">
        <h4 className='custom-modal-title'>{title}</h4>
        {children}
      </div>
      <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn red modal-close" onClick={() => { onClose(); }}>{closeLabel}</button>
        <button className="btn green" onClick={() => {  onSave(); }}>{saveLabel}</button>
      </div>
    </div>
  );
}

export default Modal;

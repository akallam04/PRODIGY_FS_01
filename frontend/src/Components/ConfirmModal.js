import React from 'react';
import Modal from './Modal';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger' }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button
                className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                style={{ width: 'auto' }}
                onClick={() => { onConfirm(); onClose(); }}
            >
                {confirmText}
            </button>
        </div>
    </Modal>
);

export default ConfirmModal;

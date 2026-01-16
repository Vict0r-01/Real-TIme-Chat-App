import React from 'react';

const ChatModal = ({ isOpen, onClose, children }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="card bg-panel p-4 w-full max-w-lg shadow-card">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Chat</h2>
                    <button onClick={onClose} className="text-secondary hover:opacity-90 text-2xl leading-none">&times;</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default ChatModal;
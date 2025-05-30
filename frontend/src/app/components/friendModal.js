import React from 'react';

const FriendModal = ({ isOpen, onClose, children }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-zinc-800 rounded-lg border-2 border-yellow-300 shadow-lg p-2 w-full max-w-sm md:max-w-md lg:max-w-lg 
                mx-auto overflow-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Friend</h2>
                    <button onClick={onClose} className="font-bold text-xl -mt-4 text-red-500 hover:text-red-700 transition-colors duration-200">&times;</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default FriendModal;
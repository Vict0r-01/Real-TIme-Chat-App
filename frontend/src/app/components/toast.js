'use client';
import { useEffect, memo } from 'react';

const Toast = memo(({ message, type = 'error', show, onHide }) => {
    useEffect(() => {
        console.log("Toast is showing: "+show);
        if(show) {
            const timer = setTimeout(() => {
                onHide();
            }, 2500);
            return () => clearTimeout(timer);
        }
    },[show, onHide]);

    const bgColor = type === 'error' ? 'bg-red-300' : 'bg-green-300';

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-fit z-50">
            <div
                className={`mt-4 bg-zinc-800 rounded-lg border-1 border-yellow-300 shadow-lg px-6 py-3 transition-all duration-300 whitespace-nowrap
                ${show ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}
            >
                <div className="text-sm font-normal">
                    <svg className={`inline-block w-4 h-4 mr-2 ${bgColor} rounded-full`}>
                    </svg>
                    {message}</div>
            </div>
        </div>
    )
});

Toast.displayName = 'Toast';
export default Toast;
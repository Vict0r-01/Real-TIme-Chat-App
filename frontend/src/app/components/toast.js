'use client';
import { useEffect, memo } from 'react';

const Toast = memo(({ message, type = 'error', show, onHide }) => {
    useEffect(() => {
        if(show) {
            const timer = setTimeout(() => {
                onHide();
            }, 2500);
            return () => clearTimeout(timer);
        }
    },[show, onHide]);

    const iconColor = type === 'error' ? 'text-red-400' : 'text-secondary';

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-fit z-50">
            <div className={`mt-2 card bg-panel px-6 py-3 transition-all duration-300 whitespace-nowrap ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
                <div className="text-sm font-normal flex items-center gap-2">
                    <svg className={`inline-block w-4 h-4 mr-2 ${iconColor}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {message}
                </div>
            </div>
        </div>
    )
});

Toast.displayName = 'Toast';
export default Toast;
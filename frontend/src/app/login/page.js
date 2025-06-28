'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import Toast from '../components/toast';
import { useCallback } from 'react';
export default function Login() {
    const {login} = useAuth();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    //Check Auth
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            if(response.ok) {
                const data = await response.json();
                login(data.token, data.account.username, data.account.profilePictureUrl);
                console.log('Login successful:', data);
                router.push('/');
            } else {
            // Show the error message from the server
            setToastMessage(data.error || 'Login failed. Please check your credentials.');
            setShowToast(true);
            }
        } catch (error) {
            setToastMessage('Login failed. Please check your credentials.');
            setShowToast(true);
        }
    };

    const handleHideToast = useCallback(() => {
        setShowToast(false);
      }, []);

    return (
        <div className="flex items-center justify-center bg-black-100 h-screen">
            <Toast message={toastMessage} show={showToast} onHide={handleHideToast} />
            <div className="flex items-center justify-center border-yellow-300 border-2 rounded-lg p-4 m-4 w-1/2 h-1/2">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h2 className="font-bold text-2xl mb-4">Login</h2>
                    <input type="text" placeholder="Username" 
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-full" onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" 
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-full" onChange={(e) => setPassword(e.target.value)}/>
                    <button 
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-1/2 font-bold text-white transition duration-300 ease-in-out hover:bg-yellow-300 hover:text-black"
                    onClick={loginHandler}>Login</button>
                </div>
            </div>
        </div>
    )
}
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import Toast from '../components/toast';
import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
export default function Login() {
    const {login} = useAuth();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const API = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const router = useRouter();
    const searchParams = useSearchParams();

    // Auto-login as testuser2 if query param is present
    useEffect(() => {
    const testuser = searchParams.get('testuser');
    if (testuser) {
      // Auto-login as testuser2
        loginRequest(testuser, 'testpassword2'); // Use the correct password for testuser2
    }
  }, [searchParams]);


    //Check Auth
    const loginHandler = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setToastMessage('Please enter both username and password.');
            setShowToast(true);
            return;
        }
        loginRequest(username, password);
    };

    const handleHideToast = useCallback(() => {
        setShowToast(false);
      }, []);

    const testHandler = async (e) => {
        window.open("/login?testuser=testuser2");
        e.preventDefault();
        loginRequest('testuser1', 'testpassword1');
        
    };

    const loginRequest = async (username, password) => {
        try {
            const response = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            if(response.ok) {
                const data = await response.json();
                (username === 'testuser1' || username === 'testuser2') ?
                    login(data.token, data.account.username, data.account.profilePictureUrl, true) :
                    login(data.token, data.account.username, data.account.profilePictureUrl);
                router.push('/');
            } else {
                setToastMessage('Login failed. Please check your credentials.');
                setShowToast(true);
            }
        } catch (error) {
            setToastMessage('Login failed. Please check your credentials.');
            setShowToast(true);
        }
    }
    return (
        <div className="flex items-center justify-center bg-black-100 h-screen">
            <Toast message={toastMessage} show={showToast} onHide={handleHideToast} />
            <div className="flex flex-col items-center justify-center border-yellow-300 border-2 rounded-lg p-4 m-4 w-1/2 h-1/2"
            onSubmit={loginHandler}>
                <form className="flex flex-col items-center justify-center w-full h-full">
                    <h2 className="font-bold text-2xl mb-4">Login</h2>
                    <input type="text" placeholder="Username" 
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-full" onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" 
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-full" onChange={(e) => setPassword(e.target.value)}/>
                    <button 
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-1/2 font-bold text-white transition duration-300 ease-in-out hover:bg-yellow-300 hover:text-black"
                    type='submit'>Login</button>
                </form>
                <div className="flex flex-col items-center w-full">
                    <p>Here to Test?</p>
                    <button
                    className="border-2 border-yellow-300 rounded-lg p-2 mb-4 w-1/2 font-bold text-white transition duration-300 ease-in-out hover:bg-yellow-300 hover:text-black"
                    onClick={testHandler}>Test</button>
                </div>
            </div>
        </div>
    )
}
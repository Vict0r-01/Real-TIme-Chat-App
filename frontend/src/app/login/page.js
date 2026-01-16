'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import Toast from '../components/toast';
import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { styles } from '../styles/style';
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
        <div className="min-h-screen flex items-center justify-center p-6">
            <Toast message={toastMessage} show={showToast} onHide={handleHideToast} />
            <div className="w-full max-w-md card p-6">
                <form className="flex flex-col" onSubmit={loginHandler}>
                    <h2 className="font-bold text-2xl mb-4 text-accent text-center">Login</h2>
                    <input type="text" placeholder="Username" 
                    className={`${styles.input} mb-4 w-full`} onChange={(e) => setUsername(e.target.value)}/>
                    <input type="password" placeholder="Password" 
                    className={`${styles.input} mb-4 w-full`} onChange={(e) => setPassword(e.target.value)}/>
                    <button 
                    className={`${styles.button} w-full mb-4`} 
                    type='submit'>Login</button>
                </form>
                <div className="flex flex-col items-center w-full">
                    <p className="muted mb-2">Here to Test?</p>
                    <button className={`${styles.button} w-1/2`} onClick={testHandler}>Test</button>
                </div>
            </div>
        </div>
    )
}
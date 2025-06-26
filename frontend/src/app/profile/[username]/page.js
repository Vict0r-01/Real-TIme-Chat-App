'use client';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import { styles } from "@/app/styles/style";
import { getImageUrl } from "@/app/config/imageUrl";
import Toast from "@/app/components/toast";
import { ApiError } from "next/dist/server/api-utils";

export default function Profile() {
    const { username: currentUser, setUsername: setCurrentUser, setProfileImage } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allowEdit, setAllowEdit] = useState(false);
    const [usernameDisplay, setUsernameDisplay] = useState(false);
    const [passwordDisplay, setPasswordDisplay] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();
    const params = useParams();
    const { username } = params; // Get username from URL
    const API = process.env.BACKEND_API_URL;

    useEffect(() => {
        if (username) {
            getUserData(username);
        }
    }, [username]); // Only re-run when username changes

    const getUserData = async (profileUsername) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API}/profile/${profileUsername}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('User data:', data);
                setUserData(data);
                setUsernameDisplay(data.username);
                setPasswordDisplay(data.password);
            } else {
                setToastMessage('Failed to fetch user data');
                setShowToast(true);
                if(response.status === 401)
                    router.push('/login'); // Redirect to login if unauthorized
            }
        } catch (error) {
            setToastMessage('Error fetching user data');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const updateProfileImage = async (image) => {
        const formData = new FormData();
        formData.append('image', image)
        try {
            const response = await fetch(`${API}/profile/${username}/updateProfilePicture`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUserData((prevData) => ({
                    ...prevData,
                    profilePictureUrl: data.profilePictureUrl,
                }));
                setProfileImage(data.profilePictureUrl);
            } else {
                setToastMessage('Failed to update image');
            }
        }catch (error) {
       setToastMessage('Error updating profile image');
        }
    };

    const updateUsername = async (newUsername) => {
        console.log('Updating username:', newUsername);
        try {
            const response = await fetch(`${API}/profile/${username}/updateUsername`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newUsername })
            });
            if (response.ok) {
                setCurrentUser(newUsername);
                setUserData((prevData) => ({
                    ...prevData,
                    name: newUsername,
                }));
                router.push(`/login`); // Redirect to the updated profile
            } else {
                setToastMessage('Failed to update username');
                setShowToast(true);
            }
        } catch (error) {
            setToastMessage('Error updating username');
        }
    };

    const updatePassword = async (newPassword) => {
        console.log('Updating password:', newPassword);
        try {
            const response = await fetch(`${API}/profile/${username}/updatePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newPassword })
            });
            if (response.ok) {
                setUserData((prevData) => ({
                    ...prevData,
                    password: newPassword,
                }));
            } else {
                setToastMessage('Failed to update password');
                setShowToast(true);
            }
        } catch (error) {
            setToastMessage('Error updating password');
        }
    };

    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file instanceof File) {
      updateProfileImage(file);
    }
  };
    const handleEditProfile = () => {
        setAllowEdit(true);
    };

    const handleImageClick = () => {
        if (currentUser === username) {
            fileInputRef.current?.click();
        }
    };
    return (
        <div className="container mx-auto p-2">
            <Toast message={toastMessage} show={showToast} onHide={() => setShowToast(false)} />
            {userData ? (
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-between mb-4 w-full">
                        <button
                            className= {`${styles.button} pt-1 pb-1 pr-4 pl-4 text-xl`}
                            onClick={() => router.back()}>
                            &#x2190;
                        </button>
                        {currentUser === username && (
                                <button 
                                    className={styles.button}
                                    onClick={handleEditProfile}
                                >
                                    Edit Profile
                                </button>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold mb-4">{userData.username}'s Profile</h1>
                    <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                    <img 
                        src={getImageUrl(userData.profilePictureUrl)} 
                        alt={`${userData.username}'s profile picture`}
                        className={`w-32 h-32 rounded-full mb-4 hover:shadow-lg border-2 border-yellow-300 cursor-pointer
                            ${currentUser === username ? 'hover:opacity-50 hover:scale-105 transition-transform duration-200' : ''}`}
                        onClick={handleImageClick}
                        title={currentUser === username ? "Click to change profile picture" : "Profile picture"}
                    />
                    <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold">{`Username: ${userData.username}`}</h2>
                    {allowEdit && (
                        <div className="flex flex-col mt-2">
                            <input 
                                type="text" 
                                placeholder="New Username" 
                                className={styles.input}
                                maxLength={20}
                                minLength={2}
                                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            />
                        </div>
                    )}
                    {(currentUser === username) && (
                        <>
                            <h2 className="text-xl font-semibold">{`Password: ${userData.password}`}</h2>
                            {allowEdit && (
                                <div className="flex flex-col mt-2">
                                    <input 
                                        type="text" 
                                        placeholder="New Password" 
                                        className={styles.input}
                                        maxLength={20}
                                        minLength={2}
                                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    {allowEdit && (
                        <div className="flex justify-center">
                            <button 
                                className={styles.button}
                                onClick={() => {
                                    setUserData({ ...userData, username: usernameDisplay ,password: passwordDisplay });
                                    setAllowEdit(false);
                                }}>
                                    Cancel
                                </button>
                            <button 
                                    className={styles.button}
                                    onClick={async () => {
                                        let usernameChanged = userData.username !== usernameDisplay;
                                        let passwordChanged = userData.password !== passwordDisplay;
                                        
                                        if(passwordChanged)
                                            await updatePassword(userData.password);

                                        if(usernameChanged) 
                                            await updateUsername(userData.username);

                                        setAllowEdit(false);
                                        if(usernameChanged || passwordChanged) {
                                            localStorage.removeItem('token');
                                            router.push('/login');
                                        }
                                    }}
                                >
                                    Save Changes
                            </button>
                        </div>
                            )}
                    </div>
                </div>
            ) : (
                <div>User not found</div>
            )}
        </div>
    );
}
'use client';
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { checkAuth } from "../../utility/checkAuth";
import { useAuth } from "../../context/authContext";
import { styles } from "@/app/styles/style";
import { getImageUrl } from "@/app/config/imageUrl";

export default function Profile() {
    const { username: currentUser, setUsername: setCurrentUser, setProfileImage } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allowEdit, setAllowEdit] = useState(false);
    const [usernameDisplay, setUsernameDisplay] = useState(false);
    const [passwordDisplay, setPasswordDisplay] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();
    const params = useParams();
    const { username } = params; // Get username from URL

    useEffect(() => {
        checkAuth(router, currentUser, setCurrentUser);
    }, [router, currentUser]);

    useEffect(() => {
        console.log(currentUser + '------' + username);
        if (username) {
            getUserData(username);
        }
    }, [username]); // Only re-run when username changes

    const getUserData = async (profileUsername) => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:8080/profile/${profileUsername}`, {
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
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
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
            const response = await fetch(`http://localhost:8080/profile/${username}/updateProfilePicture`, {
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
                console.error('Failed to update image');
            }
        }catch (error) {
        console.error('Error updating profile image:', error);
        }
    };

    const updateUsername = async (newUsername) => {
        console.log('Updating username:', newUsername);
        try {
            const response = await fetch(`http://localhost:8080/profile/${username}/updateUsername`, {
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
            }
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    const updatePassword = async (newPassword) => {
        console.log('Updating password:', newPassword);
        try {
            const response = await fetch(`http://localhost:8080/profile/${username}/updatePassword`, {
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
            }
        } catch (error) {
            console.error('Error updating password:', error);
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
                                    onClick={() => {
                                        if(userData.username !== usernameDisplay) {
                                            updateUsername(userData.username);
                                            localStorage.removeItem('token');
                                        }
                                        if(userData.password !== passwordDisplay) {
                                            updatePassword(userData.password);
                                            localStorage.removeItem('token');
                                        }
                                        setAllowEdit(false);
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
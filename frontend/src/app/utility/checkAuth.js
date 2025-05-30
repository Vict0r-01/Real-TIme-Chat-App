import React from "react";
import { isTokenExpired } from "./isTokenExpired";

export async function checkAuth(router, username, setUsername) {
    const token = localStorage.getItem('token');
    console.log('Auth Check Running, Token:', token);
    
    if (!token || await isTokenExpired(token)) {
        console.log('Token expired or not found');
        localStorage.removeItem('token');
        router.push('/login');
        return false;
    }

    if (username === '') {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken?.sub) {
            console.log('Decoded token:', decodedToken);
            setUsername(decodedToken.sub);
        }
    }
    return true;
}
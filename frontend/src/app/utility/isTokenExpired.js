export const isTokenExpired = async(token) => {
    try {
        const response = await fetch('http://localhost:8080/validate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Token validation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error validating token:', error);
        return true;
    }
};
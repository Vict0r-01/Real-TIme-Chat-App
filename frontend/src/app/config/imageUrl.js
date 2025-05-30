export const API_URL = 'http://localhost:8080';
export const getImageUrl = (path) => {
    if (!path) return '/default-avatar.png';
    return path.startsWith('http') ? path : `${API_URL}${path}`;
};
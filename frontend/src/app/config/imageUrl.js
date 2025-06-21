export const API_URL = 'http://localhost:8080';
export const getImageUrl = (path) => {
    if (!path) return `${API_URL}/uploads/default.png`;
    return path.startsWith('http') ? path : `${API_URL}${path}`;
};
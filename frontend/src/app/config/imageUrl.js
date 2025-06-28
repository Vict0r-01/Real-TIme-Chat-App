export const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const getImageUrl = (path) => {
    if (!path) return `${API_URL}/images/default.png`;
    return path.startsWith('http') ? path : `${API_URL}${path}`;
};

// Central API utility — all calls go to Express backend on port 5000
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('token') || localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
    // Sync to cookie for Next.js SSR / Server Components
    document.cookie = `auth_token=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
}

export function clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    // Normalize URL to handle trailing slashes in BASE or leading slashes in path
    const normalizedBase = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${normalizedBase}${normalizedPath}`;

    const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });
    return res;
}

// Convenience helpers
export const apiGet = (path) => apiFetch(path);
export const apiPost = (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => apiFetch(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (path) => apiFetch(path, { method: 'DELETE' });

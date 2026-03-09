'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { clearToken } from '@/lib/api';

const AuthContext = createContext(null);

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setStatus('unauthenticated');
            return;
        }

        // Decode the JWT payload (no verification at client side — just parse)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Check expiry
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                clearToken();
                setStatus('unauthenticated');
                return;
            }
            setSession({ user: { id: payload.id, email: payload.email, name: payload.name, role: payload.role, linkedStudentId: payload.linkedStudentId } });
            setStatus('authenticated');
        } catch {
            clearToken();
            setStatus('unauthenticated');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ data: session, status }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useSession() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useSession must be used within an AuthProvider');
    return context;
}

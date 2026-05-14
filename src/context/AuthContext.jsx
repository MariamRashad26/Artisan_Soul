import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            fetchUserProfile(token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async (authToken) => {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setToken(null);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (response.ok) {
                setToken(data.token);
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                });
                return { success: true, role: data.role };
            } else {
                return { success: false, message: data.message || 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, message: 'Server connection failed.' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await response.json();
            
            if (response.ok) {
                setToken(data.token);
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                });
                return { success: true, role: data.role };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, message: 'Server connection failed.' };
        }
    };

    const logout = () => {
        setToken(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

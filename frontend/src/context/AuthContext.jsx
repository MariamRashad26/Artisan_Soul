import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';

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
            fetchUserProfile();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const { data } = await axiosInstance.get('/api/auth/profile');
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axiosInstance.post('/api/auth/login', { email, password });
            setToken(data.token);
            const userData = {
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role,
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, role: data.role };
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid credentials';
            return { success: false, message };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            const { data } = await axiosInstance.post('/api/auth/register', { name, email, password, role });

            // Auto-login on successful registration
            if (data.token) {
                setToken(data.token);
                const userData = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }

            return {
                success: true,
                message: data.message,
                autoLoggedIn: !!data.token,
            };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    };

    // ✅ FIX: window.location.href nahi - React Router navigate use hoga
    // Logout sirf state clear karta hai, navigation component handle karega
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const refreshUser = () => fetchUserProfile();

    return (
        <AuthContext.Provider value={{ user, setUser, token, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

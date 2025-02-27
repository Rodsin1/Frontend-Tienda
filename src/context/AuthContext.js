import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un token en localStorage al cargar
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('userData');

            if (token && userData) {
                try {
                    const decoded = jwtDecode(token);
                    const parsedUserData = JSON.parse(userData);

                    // Verificar si el token ha expirado
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        setUser(parsedUserData);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductAdmin from './pages/ProductAdmin';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  return (
      <>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
          />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />
          <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <ProductAdmin />
                </ProtectedRoute>
              }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
  );
}

function App() {
  return (
      <ThemeProvider theme={theme}>
        <Router>
          <AuthProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
  );
}

export default App;

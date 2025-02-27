import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { userService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

// Esquema de validación con Yup
const validationSchema = yup.object({
    email: yup
        .string()
        .email('Ingrese un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    password: yup
        .string()
        .required('La contraseña es obligatoria'),
});

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        // Verificar si hay un mensaje de notificación desde el registro
        if (location.state?.message) {
            setNotificationMessage(location.state.message);
        }
    }, [location]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);

            try {
                const response = await userService.login({
                    email: values.email,
                    password: values.password,
                });

                console.log('Login response:', response.data);

                // Extraer datos directamente de la respuesta (estructura observada)
                const {
                    token,
                    id,
                    email,
                    nombres,
                    apellidos
                } = response.data;

                // Decodificar el token para información adicional si es necesario
                const decodedToken = jwtDecode(token);

                // Crear objeto de usuario con la estructura correcta
                const userData = {
                    id,
                    email,
                    nombres,
                    apellidos,
                    // Incluir información adicional del token si es relevante
                    exp: decodedToken.exp,
                    iat: decodedToken.iat
                };

                // Llamar a la función login del contexto de autenticación
                login(token, userData);

                // Redireccionar a la página principal
                navigate('/');
            } catch (err) {
                console.error('Error during login:', err);
                setError(err.response?.data?.message || 'Credenciales inválidas. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, mb: 8, p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h4" gutterBottom>
                        Iniciar Sesión
                    </Typography>

                    {notificationMessage && (
                        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                            {notificationMessage}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Correo electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/register')}
                        >
                            ¿No tienes cuenta? Regístrate
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { userService } from '../services/api';

// Esquema de validación con Yup
const validationSchema = yup.object({
    firstName: yup
        .string()
        .required('El nombre es obligatorio'),
    lastName: yup
        .string()
        .required('Los apellidos son obligatorios'),
    email: yup
        .string()
        .email('Ingrese un correo electrónico válido')
        .required('El correo electrónico es obligatorio'),
    address: yup
        .string()
        .required('La dirección de envío es obligatoria'),
    birthDate: yup
        .date()
        .max(new Date(), 'La fecha no puede ser futura')
        .required('La fecha de nacimiento es obligatoria'),
    password: yup
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .required('La contraseña es obligatoria'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Confirme su contraseña'),
});

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            birthDate: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            setError(null);

            try {

                const userData = {
                    nombres: values.firstName,
                    apellidos: values.lastName,
                    email: values.email,
                    direccionEnvio: values.address,
                    fechaNacimiento: values.birthDate,
                    password: values.password,
                };

                await userService.register(userData);


                navigate('/login', { state: { message: 'Registro exitoso. Por favor inicie sesión.' } });
            } catch (err) {
                console.error('Error during registration:', err);
                setError(err.response?.data?.message || 'Error en el registro. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{ mt: 8, mb: 8, p: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h4" gutterBottom>
                        Registro de Usuario
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Complete el formulario para crear su cuenta
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label="Nombres"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                    helperText={formik.touched.firstName && formik.errors.firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label="Apellidos"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                    helperText={formik.touched.lastName && formik.errors.lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Correo electrónico"
                                    type="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="address"
                                    name="address"
                                    label="Dirección de envío"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="birthDate"
                                    name="birthDate"
                                    label="Fecha de nacimiento"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={formik.values.birthDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                                    helperText={formik.touched.birthDate && formik.errors.birthDate}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirmar contraseña"
                                    type="password"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            ¿Ya tienes una cuenta? Inicia sesión
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;

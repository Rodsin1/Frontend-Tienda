import React, { useState, useEffect, useContext } from 'react';
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
    CircularProgress,
    Divider
} from '@mui/material';
import { userService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

// Esquema de validación con Yup
const validationSchema = yup.object({
    firstName: yup
        .string()
        .required('El nombre es obligatorio y debe tener al menos 3 caracteres'),
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
});

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const response = await userService.getProfile();
                setUserData(response.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('No se pudo cargar la información del perfil');


                setUserData({
                    id: 1,
                    firstName: user?.firstName || 'Usuario',
                    lastName: user?.lastName || 'Ejemplo',
                    email: user?.email || 'usuario@ejemplo.com',
                    address: 'Dirección de ejemplo 123',
                    birthDate: '1990-01-01'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: userData?.nombres || '',
            lastName: userData?.apellidos || '',
            email: userData?.email || '',
            address: userData?.direccionEnvio || '',
            birthDate: userData?.fechaNacimiento ? userData.fechaNacimiento.split('T')[0] : '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setUpdating(true);
            setError(null);
            setSuccess(false);

            try {

                const updatedData = {
                    nombres: values.firstName,
                    apellidos: values.lastName,
                    email: values.email,
                    direccionEnvio: values.address,
                    fechaNacimiento: values.birthDate
                };


                await userService.updateProfile(user.id, updatedData);
                setSuccess(true);
            } catch (err) {
                console.error('Error updating profile:', err);
                setError(err.response?.data?.message || 'Error al actualizar el perfil');
            } finally {
                setUpdating(false);
            }
        },
    });

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography component="h1" variant="h4" gutterBottom align="center">
                    Mi Perfil
                </Typography>
                <Divider sx={{ mb: 4 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Perfil actualizado con éxito
                    </Alert>
                )}

                <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
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
                                disabled
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
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={updating}
                        >
                            {updating ? <CircularProgress size={24} /> : 'Actualizar Perfil'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;

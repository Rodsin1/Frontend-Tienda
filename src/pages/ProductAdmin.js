import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { productService } from '../services/api';

// Esquema de validación del producto
const validationSchema = yup.object({
    nombre: yup
        .string()
        .required('El nombre es obligatorio'),
    descripcion: yup
        .string()
        .required('La descripción es obligatoria'),
    precio: yup
        .number()
        .positive('El precio debe ser positivo')
        .required('El precio es obligatorio'),
    urlImagen: yup
        .string()
        .url('Debe ser una URL válida')
        .required('La URL de la imagen es obligatoria'),
    stock: yup
        .number()
        .integer('El stock debe ser un número entero')
        .min(0, 'El stock no puede ser negativo')
        .required('El stock es obligatorio'),
});

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Cargar productos
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAll();
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('No se pudieron cargar los productos');

            // Datos de ejemplo en caso de error (para desarrollo)
            setProducts([
                {
                    id: 1,
                    nombre: 'Balón de Fútbol',
                    descripcion: 'Balón oficial de la liga profesional, tamaño 5',
                    precio: 49.99,
                    urlImagen: 'https://via.placeholder.com/300/FF4560/FFFFFF?text=Balon',
                    stock: 100
                },
                {
                    id: 2,
                    nombre: 'Raqueta de Tenis',
                    descripcion: 'Raqueta profesional con cordaje de alta tensión',
                    precio: 129.99,
                    urlImagen: 'https://via.placeholder.com/300/4ECDC4/000000?text=Raqueta',
                    stock: 50
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Formik para manejar el formulario
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre: editingProduct?.nombre || '',
            descripcion: editingProduct?.descripcion || '',
            precio: editingProduct?.precio || '',
            urlImagen: editingProduct?.urlImagen || '',
            stock: editingProduct?.stock || 0,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                if (editingProduct) {
                    // Actualizar producto existente
                    await productService.update(editingProduct.id, values);
                    setSuccess('Producto actualizado con éxito');
                } else {
                    // Crear nuevo producto
                    await productService.create(values);
                    setSuccess('Producto creado con éxito');
                }
                fetchProducts();
                setEditingProduct(null);
                formik.resetForm();
            } catch (err) {
                console.error('Error saving product:', err);
                setError(err.response?.data?.message || 'Error al guardar el producto');
            } finally {
                setLoading(false);
            }
        },
    });

    // Funciones para manejar acciones
    const handleEdit = (product) => {
        setEditingProduct(product);
        window.scrollTo(0, 0);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setLoading(true);
        try {
            await productService.delete(deleteId);
            setSuccess('Producto eliminado con éxito');
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            setError(err.response?.data?.message || 'Error al eliminar el producto');
        } finally {
            setLoading(false);
            setOpenDialog(false);
            setDeleteId(null);
        }
    };

    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDialog(false);
        setDeleteId(null);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        formik.resetForm();
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Administración de Productos
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Formulario de producto */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </Typography>

                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="nombre"
                                name="nombre"
                                label="Nombre del producto"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                                helperText={formik.touched.nombre && formik.errors.nombre}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="precio"
                                name="precio"
                                label="Precio"
                                type="number"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.precio && Boolean(formik.errors.precio)}
                                helperText={formik.touched.precio && formik.errors.precio}
                                margin="normal"
                                InputProps={{
                                    startAdornment: <span>$</span>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="descripcion"
                                name="descripcion"
                                label="Descripción"
                                multiline
                                rows={3}
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                                helperText={formik.touched.descripcion && formik.errors.descripcion}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                id="urlImagen"
                                name="urlImagen"
                                label="URL de la imagen"
                                value={formik.values.urlImagen}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.urlImagen && Boolean(formik.errors.urlImagen)}
                                helperText={formik.touched.urlImagen && formik.errors.urlImagen}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                id="stock"
                                name="stock"
                                label="Stock"
                                type="number"
                                value={formik.values.stock}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.stock && Boolean(formik.errors.stock)}
                                helperText={formik.touched.stock && formik.errors.stock}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {editingProduct && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelEdit}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={editingProduct ? null : <AddIcon />}
                        >
                            {loading ? <CircularProgress size={24} /> : (editingProduct ? 'Actualizar' : 'Agregar Producto')}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Lista de productos */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Listado de Productos
                </Typography>

                {loading && products.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Precio</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.nombre}</TableCell>
                                        <TableCell>${product.precio.toFixed(2)}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleOpenDeleteDialog(product.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductAdmin;

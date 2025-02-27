import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Divider,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { cartService } from '../services/api';

const Cart = () => {
    const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Helper function to safely format prices
    const formatPrice = (price) => {
        return price !== undefined && price !== null
            ? Number(price).toFixed(2)
            : '0.00';
    };

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity >= 1) {
            // Asegúrate de que estás usando el productoId
            updateQuantity(item.productoId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Envía un objeto vacío porque el backend ignora los datos enviados
            // y crea la orden basada en el carrito guardado en la base de datos
            const response = await cartService.saveOrder({});

            // Asegúrate de que la propiedad de la respuesta coincida con la enviada por el backend
            // Podría ser response.data.id o response.data.orderId, etc.
            setOrderId(response.data.id || response.data.orderId || response.data.ordenId);
            setOrderSuccess(true);
            clearCart();
        } catch (err) {
            console.error('Error saving order:', err);
            setError(err.response?.data?.message || 'Error al procesar el pedido');

            // Comentar o eliminar la simulación de éxito para diagnosticar mejor los problemas
            // Si quieres mantener la simulación de éxito para fines de desarrollo:
            /*
            setOrderId("ORD-" + Math.floor(100000 + Math.random() * 900000));
            setOrderSuccess(true);
            clearCart();
            */
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessDialog = () => {
        setOrderSuccess(false);
        navigate('/');
    };

    if ((!cart || cart.length === 0) && !orderSuccess) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Tu carrito está vacío
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        ¡Agrega productos desde nuestro catálogo para comenzar tu compra!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/products')}
                    >
                        Ver Productos
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Carrito de Compras
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Producto</TableCell>
                                    <TableCell align="right">Precio</TableCell>
                                    <TableCell align="center">Cantidad</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {cart.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell component="th" scope="row">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                                <Box
                                                    component="img"
                                                    sx={{
                                                        height: 50,
                                                        width: 50,
                                                        objectFit: 'contain',
                                                        mr: 2,
                                                        display: { xs: 'none', sm: 'block' }
                                                    }}
                                                    alt={item.nombreProducto || 'Product'}
                                                    src={item.urlImagen}
                                                />
                                                <Typography variant="body1">{item.nombreProducto || 'Product'}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">${formatPrice(item.precioUnitario)}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item, (item.cantidad || 1) - 1)}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <TextField
                                                    size="small"
                                                    value={item.cantidad || 1}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (!isNaN(value)) {
                                                            handleQuantityChange(item, value); // Pasar el item completo
                                                        }
                                                    }}
                                                    inputProps={{
                                                        min: 1,
                                                        style: { textAlign: 'center', width: '40px' }
                                                    }}
                                                    variant="outlined"
                                                    sx={{ mx: 1 }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item, (item.cantidad || 1) + 1)}

                                                >
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            ${formatPrice((item.precioUnitario || 0) * (item.cantidad || 1))}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromCart(item.productoId)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Resumen del Pedido
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">Artículos ({totalItems || 0})</Typography>
                            <Typography variant="body1">${formatPrice(totalPrice)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">Envío</Typography>
                            <Typography variant="body1">Gratis</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6">${formatPrice(totalPrice)}</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Completar Compra'}
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            size="large"
                            onClick={() => navigate('/products')}
                            sx={{ mt: 2 }}
                        >
                            Continuar Comprando
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={orderSuccess}
                onClose={handleCloseSuccessDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    ¡Pedido Realizado con Éxito!
                </DialogTitle>
                <DialogContent>
                    {/* Usar Typography directamente en lugar de DialogContentText */}
                    <Typography variant="body1" paragraph>
                        Gracias por tu compra. Tu pedido ha sido procesado correctamente.
                    </Typography>

                    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="body1" gutterBottom>
                            <strong>ID de Orden:</strong> {orderId}
                        </Typography>
                        <Typography variant="body2">
                            Recibirás un correo electrónico con los detalles de tu pedido.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSuccessDialog} autoFocus>
                        Volver a la Tienda
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Cart;

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Chip,
    Grid,
    Card,
    CardContent,
    Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { cartService } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await cartService.getOrders();
                setOrders(response.data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar los pedidos:', err);
                setError('Error al cargar los pedidos. Por favor, intenta nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        try {
            const date = new Date(dateString);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };


            try {
                return new Intl.DateTimeFormat('es-ES', options).format(date);
            } catch (localeError) {

                return date.toLocaleString();
            }
        } catch (e) {
            return dateString;
        }
    };

    const calculateTotal = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((total, item) => {

            const precio = item && typeof item.precio === 'number' ? item.precio : 0;
            const cantidad = item && typeof item.cantidad === 'number' ? item.cantidad : 0;
            return total + (precio * cantidad);
        }, 0);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography variant="h6">Cargando tus pedidos...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (orders.length === 0) {
        return (
            <Container sx={{ mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>Mis Pedidos</Typography>
                    <Alert severity="info">
                        No tienes pedidos realizados. ¡Explora nuestros productos y haz tu primera compra!
                    </Alert>
                </Paper>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom>
                Mis Pedidos
            </Typography>

            <Box sx={{ mb: 4 }}>
                {orders.map((order) => (
                    <Card key={order.id} sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">
                                        Orden #{order.id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Fecha: {formatDate(order.fechaCreacion)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                                    <Typography variant="h6">
                                        Total: ${order.total.toFixed(2)}
                                    </Typography>
                                    <Chip
                                        label={order.estado === 'COMPLETADO' ? 'Completado' : 'Pendiente'}
                                        color="success"
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel-${order.id}-content`}
                                    id={`panel-${order.id}-header`}
                                >
                                    <Typography>
                                        Detalles del pedido ({order.items && Array.isArray(order.items) ? order.items.length : 0} productos)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Producto</TableCell>
                                                    <TableCell align="right">Precio</TableCell>
                                                    <TableCell align="right">Cantidad</TableCell>
                                                    <TableCell align="right">Subtotal</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(order.items || []).map((item, index) => (
                                                    <TableRow key={item.productoId || index}>
                                                        <TableCell component="th" scope="row">
                                                            {item.nombreProducto}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            ${typeof item.precioUnitario === 'number' ? item.precioUnitario.toFixed(2) : '0.00'}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {typeof item.cantidad === 'number' ? item.cantidad : 0}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            ${typeof item.precioUnitario === 'number' && typeof item.cantidad === 'number'
                                                            ? (item.precioUnitario * item.cantidad).toFixed(2)
                                                            : '0.00'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={3} align="right">
                                                        <Typography variant="subtitle1">Total</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="subtitle1">
                                                            ${order.total.toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default Orders;

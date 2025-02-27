import React, { useContext } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={product.urlImagen || product.imageUrl}
                alt={product.nombre || product.name}
                sx={{ objectFit: 'contain', padding: 2 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {product.nombre || product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.descripcion || product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                    ${(product.precio || product.price).toFixed(2)}
                </Typography>
            </CardContent>
            <CardActions>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        fullWidth
                    >
                        Agregar al carrito
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
};

export default ProductCard;

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await productService.getAll();
                // Seleccionar algunos productos destacados (por ejemplo, los primeros 4)
                setFeaturedProducts(response.data.slice(0, 4));
                setLoading(false);
            } catch (err) {
                console.error('Error fetching featured products:', err);
                setError('No se pudieron cargar los productos destacados');
                setLoading(false);

                // Datos de demostración en caso de error
                setFeaturedProducts([
                    {
                        id: 1,
                        name: 'Balón de Fútbol Profesional',
                        description: 'Balón de fútbol de alta calidad para uso profesional.',
                        price: 49.99,
                        imageUrl: 'https://via.placeholder.com/300/FF4560/FFFFFF?text=Balon+Futbol'
                    },
                    {
                        id: 2,
                        name: 'Zapatillas Running Pro',
                        description: 'Zapatillas de running con tecnología de amortiguación premium.',
                        price: 129.99,
                        imageUrl: 'https://via.placeholder.com/300/4ECDC4/000000?text=Zapatillas'
                    },
                    {
                        id: 3,
                        name: 'Raqueta de Tenis GT',
                        description: 'Raqueta de tenis profesional con marco de carbono.',
                        price: 189.99,
                        imageUrl: 'https://via.placeholder.com/300/C7F464/000000?text=Raqueta'
                    },
                    {
                        id: 4,
                        name: 'Mochila Deportiva',
                        description: 'Mochila espaciosa con compartimentos para equipo deportivo.',
                        price: 69.99,
                        imageUrl: 'https://via.placeholder.com/300/1A535C/FFFFFF?text=Mochila'
                    }
                ]);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <Box>
            {/* Hero Section */}
            <Paper
                sx={{
                    position: 'relative',
                    backgroundColor: 'grey.800',
                    color: '#fff',
                    mb: 4,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: 'url(https://fundaciondelcorazon.com/images/stories/iStock-949190756.jpg)',
                    height: {xs: '50vh', md: '70vh'},
                }}
            >
                {}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,.4)',
                    }}
                />
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: '100%', position: 'relative', textAlign: 'center', px: 3 }}
                >
                    <Grid item>
                        <Typography component="h1" variant="h2" color="inherit" gutterBottom>
                            TIENDA DEPORTIVA
                        </Typography>
                        <Typography variant="h5" color="inherit" paragraph>
                            Los mejores artículos deportivos para tus actividades físicas
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            component={RouterLink}
                            to="/products"
                            sx={{ mt: 4 }}
                        >
                            Ver Productos
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    component="h2"
                    variant="h3"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                >
                    Productos Destacados
                </Typography>

                {loading ? (
                    <Typography align="center">Cargando productos...</Typography>
                ) : error ? (
                    <Typography align="center" color="error">{error}</Typography>
                ) : (
                    <>
                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            {featuredProducts.map((product) => (
                                <Grid item key={product.id} xs={12} sm={6} md={3}>
                                    <ProductCard product={product} />
                                </Grid>
                            ))}
                        </Grid>

                        <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                component={RouterLink}
                                to="/products"
                            >
                                Ver todos los productos
                            </Button>
                        </Box>
                    </>
                )}
            </Container>

            {}
            <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        component="h2"
                        variant="h3"
                        align="center"
                        color="textPrimary"
                        gutterBottom
                    >
                        ¿Por qué elegirnos?
                    </Typography>

                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                                <Typography variant="h5" gutterBottom>
                                    Calidad Garantizada
                                </Typography>
                                <Typography>
                                    Todos nuestros productos son seleccionados cuidadosamente para
                                    asegurar la mejor calidad para nuestros clientes.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                                <Typography variant="h5" gutterBottom>
                                    Envío Rápido
                                </Typography>
                                <Typography>
                                    Realizamos envíos a todo el país en tiempo récord para que
                                    disfrutes de tus productos lo antes posible.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box textAlign="center">
                                <Typography variant="h5" gutterBottom>
                                    Atención Personalizada
                                </Typography>
                                <Typography>
                                    Nuestro equipo está listo para asesorarte y ayudarte a encontrar
                                    los productos perfectos para tus necesidades.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;

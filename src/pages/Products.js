import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    // Paginación
    const [page, setPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await productService.getAll();
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('No se pudieron cargar los productos');
                setLoading(false);

                // Datos de demostración en caso de error
                /*setProducts([
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
                    },
                    {
                        id: 5,
                        name: 'Bicicleta de Montaña',
                        description: 'Bicicleta para terrenos difíciles con suspensión de alta calidad.',
                        price: 549.99,
                        imageUrl: 'https://via.placeholder.com/300/FF9F1C/000000?text=Bicicleta'
                    },
                    {
                        id: 6,
                        name: 'Casco de Ciclismo',
                        description: 'Casco ligero y resistente para protección durante el ciclismo.',
                        price: 89.99,
                        imageUrl: 'https://via.placeholder.com/300/2EC4B6/FFFFFF?text=Casco'
                    },
                    {
                        id: 7,
                        name: 'Tabla de Surf',
                        description: 'Tabla de surf para principiantes y nivel intermedio.',
                        price: 399.99,
                        imageUrl: 'https://via.placeholder.com/300/E71D36/FFFFFF?text=Tabla+Surf'
                    },
                    {
                        id: 8,
                        name: 'Pesa Rusa 16kg',
                        description: 'Pesa rusa de hierro fundido para entrenamiento funcional.',
                        price: 79.99,
                        imageUrl: 'https://via.placeholder.com/300/011627/FFFFFF?text=Pesa'
                    },
                    {
                        id: 9,
                        name: 'Guantes de Boxeo',
                        description: 'Guantes profesionales para entrenamiento y combate.',
                        price: 65.99,
                        imageUrl: 'https://via.placeholder.com/300/FDFFFC/000000?text=Guantes'
                    },
                    {
                        id: 10,
                        name: 'Pelota de Baloncesto',
                        description: 'Balón oficial de baloncesto para competiciones.',
                        price: 39.99,
                        imageUrl: 'https://via.placeholder.com/300/FF5376/FFFFFF?text=Pelota'
                    }
                ]);*/
            }
        };

        fetchProducts();
    }, []);


    const filterAndSortProducts = () => {
        let filteredProducts = [...products];

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                (product.nombre || product.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.descripcion || product.description).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenar productos
        switch (sortBy) {
            case 'name':
                filteredProducts.sort((a, b) => (a.nombre || a.name).localeCompare(b.nombre || b.name));
                break;
            case 'price-asc':
                filteredProducts.sort((a, b) => (a.precio || a.price) - (b.precio || b.price));
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => (b.precio || b.price) - (a.precio || a.price));
                break;
            default:
                break;
        }

        return filteredProducts;
    };

    const filteredAndSortedProducts = filterAndSortProducts();

    // Calcular paginación
    const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
    const currentProducts = filteredAndSortedProducts.slice(
        (page - 1) * productsPerPage,
        page * productsPerPage
    );

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Catálogo de Productos
            </Typography>

            {/* Barra de filtros y ordenamiento */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                    fullWidth
                    label="Buscar productos"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // Resetear paginación al buscar
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="sort-label">Ordenar por</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sortBy}
                        label="Ordenar por"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="name">Nombre (A-Z)</MenuItem>
                        <MenuItem value="price-asc">Precio: Menor a Mayor</MenuItem>
                        <MenuItem value="price-desc">Precio: Mayor a Menor</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : filteredAndSortedProducts.length === 0 ? (
                <Alert severity="info">No se encontraron productos con esos criterios de búsqueda</Alert>
            ) : (
                <>
                    <Grid container spacing={4}>
                        {currentProducts.map((product) => (
                            <Grid item key={product.id} xs={12} sm={6} md={3}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default Products;

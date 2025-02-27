import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Box,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Avatar
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/');
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const menuId = 'primary-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                Mi Perfil
            </MenuItem>
            <MenuItem component={RouterLink} to="/orders" onClick={handleMenuClose}>
                Mis Pedidos
            </MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
        </Menu>
    );

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                TIENDA DEPORTIVA
            </Typography>
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/" sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Inicio" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/products" sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Productos" />
                    </ListItemButton>
                </ListItem>
                {!isAuthenticated ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/login" sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Iniciar Sesión" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/register" sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Registrarse" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/profile" sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Mi Perfil" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/orders" sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Mis Ordenes" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
                                <ListItemText primary="Cerrar Sesión" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2, display: { sm: 'none' } }}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            variant="h6"
                            noWrap
                            component={RouterLink}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', sm: 'flex' },
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TIENDA DEPORTIVA
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
                            <Button
                                component={RouterLink}
                                to="/"
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Inicio
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/products"
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                Productos
                            </Button>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ display: 'flex' }}>
                            <IconButton
                                component={RouterLink}
                                to="/cart"
                                size="large"
                                color="inherit"
                            >
                                <Badge badgeContent={totalItems} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>

                            {isAuthenticated ? (
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    {user?.avatar ? (
                                        <Avatar alt={user.name} src={user.avatar} sx={{ width: 32, height: 32 }} />
                                    ) : (
                                        <AccountCircleIcon />
                                    )}
                                </IconButton>
                            ) : (
                                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                                    <Button
                                        component={RouterLink}
                                        to="/login"
                                        color="inherit"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to="/register"
                                        color="inherit"
                                    >
                                        Registrarse
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>

            {renderMenu}
        </>
    );
};

export default Navbar;

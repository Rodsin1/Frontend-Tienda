import axios from 'axios';

// URLs base para cada microservicio
const API_URLS = {
    usuarios: 'http://localhost:8081/api',
    productos: 'http://localhost:8082/api',
    carrito: 'http://localhost:8083/api'
};

// Función para crear instancias de axios con diferentes URLs base
const createApiInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Interceptor para agregar el token de autenticación a las peticiones
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

// Crear instancias para cada microservicio
const usuariosApi = createApiInstance(API_URLS.usuarios);
const productosApi = createApiInstance(API_URLS.productos);
const carritoApi = createApiInstance(API_URLS.carrito);

// Servicios para usuarios
export const userService = {
    register: (userData) => usuariosApi.post('/usuarios/registro', userData),
    login: (credentials) => usuariosApi.post('/usuarios/login', credentials),
    getProfile: () => usuariosApi.get('/usuarios/perfil'),
    updateProfile: (id, userData) => usuariosApi.put(`/usuarios/${id}`, userData),
};

// Servicios para productos
export const productService = {
    getAll: () => productosApi.get('/productos'),
    getById: (id) => productosApi.get(`/productos/${id}`),
    search: (name) => productosApi.get(`/productos/buscar/${name}`),
    create: (productData) => productosApi.post('/productos', productData),
    update: (id, productData) => productosApi.put(`/productos/${id}`, productData),
    delete: (id) => productosApi.delete(`/productos/${id}`),
};

// Servicios para el carrito de compras
export const cartService = {
    saveOrder: (orderData) => carritoApi.post('/ordenes', orderData),
    getOrders: () => carritoApi.get('/ordenes'),

    // Métodos para el carrito temporal
    getCart: () => carritoApi.get('/carrito'),
    addToCart: (cartItem) => carritoApi.post('/carrito', cartItem),
    // Asegúrate de que esté enviando { cantidad: quantity } y no { quantity: quantity }
    updateCartItem: (id, quantity) => carritoApi.put(`/carrito/${id}`, { cantidad: quantity }),
    removeFromCart: (id) => carritoApi.delete(`/carrito/${id}`),
    clearCart: () => carritoApi.delete('/carrito'),
};


export const apiInstances = {
    usuarios: usuariosApi,
    productos: productosApi,
    carrito: carritoApi
};

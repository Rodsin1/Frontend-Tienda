import React, { createContext, useState, useEffect } from 'react';
import { cartService } from '../services/api'; // Asegúrate de que la ruta sea correcta

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    // Cargar el carrito desde el backend al iniciar
    useEffect(() => {
        const fetchCart = async () => {
            try {

                if (localStorage.getItem('token')) {
                    const response = await cartService.getCart();
                    if (response.data && response.data.items) {
                        setCart(response.data.items);
                        calculateTotals(response.data.items);
                    }
                } else {

                    const savedCart = localStorage.getItem('cart');
                    if (savedCart) {
                        const parsedCart = JSON.parse(savedCart);
                        setCart(parsedCart);
                        calculateTotals(parsedCart);
                    }
                }
            } catch (error) {
                console.error("Error al cargar el carrito:", error);
                // Intentar usar localStorage como respaldo
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCart(parsedCart);
                    calculateTotals(parsedCart);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Guardar en localStorage como respaldo
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, loading]);

    const calculateTotals = (cartItems) => {
        // Verificar si cartItems es un array
        if (!Array.isArray(cartItems)) return;

        // Usar las propiedades correctas del backend
        const items = cartItems.reduce((sum, item) => sum + (item.cantidad || 0), 0);
        const price = cartItems.reduce((sum, item) =>
            sum + ((item.precioUnitario || 0) * (item.cantidad || 1)), 0);

        setTotalItems(items);
        setTotalPrice(price);
    };

    const addToCart = async (product) => {
        try {
            if (localStorage.getItem('token')) {
                // Si hay usuario logueado, usar API
                const carritoItemDTO = {
                    productoId: product.id,
                    cantidad: 1 // Agregar de a uno
                };
                const response = await cartService.addToCart(carritoItemDTO);
                if (response.data && response.data.items) {
                    setCart(response.data.items);
                    calculateTotals(response.data.items);
                }
            } else {
                // Si no hay usuario logueado, usar estado local
                setCart(prevCart => {
                    const existingItem = prevCart.find(item => item.id === product.id);
                    if (existingItem) {
                        return prevCart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: (item.quantity || 1) + 1 }
                                : item
                        );
                    } else {
                        return [...prevCart, { ...product, quantity: 1 }];
                    }
                });
            }
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            if (localStorage.getItem('token')) {
                // Si hay usuario logueado, usar API
                const response = await cartService.removeFromCart(productId);
                if (response.data && response.data.items) {
                    setCart(response.data.items);
                    calculateTotals(response.data.items);
                } else {
                    // Si la respuesta no incluye items (ej: respuesta vacía), asumimos carrito vacío
                    setCart([]);
                    calculateTotals([]);
                }
            } else {
                // Si no hay usuario logueado, usar estado local
                setCart(prevCart => prevCart.filter(item => item.id !== productId));
            }
        } catch (error) {
            console.error("Error al eliminar del carrito:", error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                return removeFromCart(productId);
            }

            if (localStorage.getItem('token')) {
                // Si hay usuario logueado, usar API
                // IMPORTANTE: Asegúrate de enviar el campo 'cantidad' y no 'quantity'
                const response = await cartService.updateCartItem(productId, quantity);
                if (response.data && response.data.items) {
                    setCart(response.data.items);
                    calculateTotals(response.data.items);
                }
            } else {
                // Si no hay usuario logueado, usar estado local
                setCart(prevCart =>
                    prevCart.map(item =>
                        item.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                );
            }
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        }
    };

    const clearCart = async () => {
        try {
            if (localStorage.getItem('token')) {
                // Si hay usuario logueado, vaciar carrito en API
                await cartService.clearCart();
            }
            // Siempre limpiar estado local
            setCart([]);
            calculateTotals([]);
        } catch (error) {
            console.error("Error al vaciar el carrito:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                loading
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

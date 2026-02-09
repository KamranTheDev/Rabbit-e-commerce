import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//helper function to load cart from local storage
const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) :{product: [] };
};

//helper function to save cart to local storage
const saveCartToStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

//fetch cart for user or guest
export const fetchCart = createAsyncThunk('cart/fetchCart', async ({userId,guestId},{rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            {
                params: {
                    userId: userId,
                    guestId: guestId
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.response.data);
    }
});

// add item to cart for user or guest
export const addToCart = createAsyncThunk('cart/addToCart', async ({userId,guestId,productId,
    quantity,size,color},{rejectWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    userId,
                    guestId,
                    productId,
                    quantity,
                    size,
                    color,
                }
            );
            return response.data;
        } catch (error) {
            // console.error(error);
            return rejectWithValue(error.response.data);
        }
    });
    //update the quantity of an item in the cart
    export const updateCartItemQuantity = createAsyncThunk('cart/updateCartItemQuantity', async ({userId,guestId,productId,
        quantity,size,color},{rejectWithValue}) => {
            try {
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                    {
                        userId,
                        guestId,
                        productId,
                        quantity,
                        size,
                        color,
                    }
                );
                return response.data;
            } catch (error) {
                // console.error(error);
                return rejectWithValue(error.response.data);
            }
        }
    );

//remove item from cart 
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({userId,guestId,productId,
    size,color},{rejectWithValue}) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                params: {
                    userId,
                    guestId,
                    productId,
                    size,
                    color,
                }
            }
               
            );
            return response.data;
        } catch (error) {
            // console.error(error);
            return rejectWithValue(error.response.data);
        }
    }
);

//merge guest cart with user cart
export const mergeCart = createAsyncThunk('cart/mergeCart', async ({user,guestId},{rejectWithValue}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
            {
                user,
                guestId,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        // console.error(error);
        return rejectWithValue(error.response.data);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cart = {products: [] };
            localStorage.removeItem('cart');
            
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ||"Failed to fetch cart";
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(state.cart);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message  || "Failed to add item to cart";
            })
            .addCase(updateCartItemQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to update item quantity in cart";
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state,action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to remove item from cart";
            })
            .addCase(mergeCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
                saveCartToStorage(action.payload);
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to merge cart";
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
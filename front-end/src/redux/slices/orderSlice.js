import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch the order of users
export const fetchuserOrders = createAsyncThunk(
  "order/fetchuserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        
          },
        }
      );
      return response.data;
    } catch (error) {
      // console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);
// Async thunk to fetch the order details by Id
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        totalOrders: 0,
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchuserOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchuserOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchuserOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        .addCase(fetchOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.orderDetails = action.payload;
        })
        .addCase(fetchOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    },
    });
export default orderSlice.reducer;
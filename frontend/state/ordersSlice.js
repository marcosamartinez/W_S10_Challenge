import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrderHistory = createAsyncThunk(
  "orders/fetchHistory",
  async () => {
    const response = await fetch("http://localhost:9009/api/pizza/history");
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return response.json();
  }
);

export const submitOrder = createAsyncThunk(
  "orders/submitOrder",
  async (orderData) => {
    const response = await fetch("http://localhost:9009/api/pizza/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    // Parse the JSON response
    const data = await response.json();

    // If response is not ok, throw the error with the message from the server
    if (!response.ok) {
      throw new Error(data.message || "Failed to submit order");
    }

    return data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    history: [],
    selectedSize: "All",
    status: "idle",
    error: null,
  },
  reducers: {
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitOrder.pending, (state) => {
        state.submitStatus = "pending";
        state.submitError = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.submitError = null;
        state.history.push(action.payload);
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.error.message;
      });
  },
});

export const { setSelectedSize } = ordersSlice.actions;
export default ordersSlice.reducer;

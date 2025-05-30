import { createSlice } from '@reduxjs/toolkit';
import fetchCartItems from './thunks/fetchCartItems';
import addItemToCart from './thunks/addItemToCart';
import removeItemFromCart from './thunks/removeItemFromCart';
import dummy2 from '../../../../dummy2';


const initialState = {
  items: dummy2,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to add an item directly (e.g., when no API call is needed)
    addItemcart: (state, action) => {
      state.items.push(action.payload.data);
    },
    // Action to remove an item directly (e.g., when no API call is needed)
    removeItemcart: (state, action) => {
      state.items = state.items.filter((item) => item.product_details.id !== action.payload);
    },

  },
  extraReducers: (builder) => {
    // Fetch cart items
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload === null) {

        } else {
          state.items = action.payload;
        }


      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        if (action.payload.message === "No products in the cart")
        {
          state.items = [];
        }

      })
      // Add item to the cart
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const exist = state.items.find((item) => { return item.id === action.payload.id })
        if (!exist) {
          state.items.push(action.payload);

        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Remove item from the cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((item) => {
          return item.id !== action.payload

        })
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});


// Export reducer
export default cartSlice.reducer;

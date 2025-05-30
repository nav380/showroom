import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import DjangoConfig from '../../../../config/config';

// Async thunk to remove an item from the cart
 const removeItemFromCart = createAsyncThunk(
    'cart/removeItemFromCart',
    async (item, { rejectWithValue }) => {
      try {  
        // Pass the item ID directly in the URL path
        const response = await axios.delete(`${DjangoConfig.apiUrl}/main/add-to-cart/${item.id}`,); 
        return item.id; // Return the ID of the removed item
      } catch (error) {
        return rejectWithValue(error.response.data || { error: "Something went wrong" });
      }
    }
  );
  export default removeItemFromCart;
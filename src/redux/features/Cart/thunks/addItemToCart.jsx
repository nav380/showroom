import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import DjangoConfig from '../../../../config/config';

// Async thunk to add an item to the cart
const addItemToCart = createAsyncThunk(
    'cart/addItemToCart',
    async (item, { rejectWithValue }) => {
      console.log(item.id)
      try {
      
        // Sending a POST request with the correct JSON body
        const response = await axios.post(
         ` ${DjangoConfig.apiUrl}/main/add-to-cart/`, // Correct API endpoint
          { product_id: item.id }// Properly structured JSON payload
        );
        if(response.status === 201){
          return item
        }
        
      } catch (error) {
        // Handle error response
        return rejectWithValue(error.response?.data || { error: "Something went wrong" });
      }
    }
  );
  export default addItemToCart;
  
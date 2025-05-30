import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import DjangoConfig from '../../../../config/config';
import getItemById from '../../../../components/fatchoneproduct';


// Async thunk to fetch cart items from API (simulate a fetch operation)
const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (item, { rejectWithValue }) => {
      try {  
        const response = await axios.get(`${DjangoConfig.apiUrl}/main/add-to-cart/`,{headers: {
          "Content-Type": "application/json",
        },
      }); 
        const cart=[];

        await Promise.all(response.data.cart.map(async (item) => {
          const details = await getItemById(item.product_details.id);
          cart.push({...item.product_details, ...details}); 
        }));
        
        return cart; // Return fetched cart items

        
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export default fetchCartItems;
import { createAsyncThunk } from "@reduxjs/toolkit";
import DjangoConfig from "../../../../config/config";
import axios from "axios";


const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_,{rejectWithValue}) => {
      try{
      const response = await axios.get(`${DjangoConfig.apiUrl}/main/home`
       
      );
      return response.data; 
    }catch(err){
      return rejectWithValue(err.response?.data || { error: "Something went wrong" });
    }
    }
  );
  export default fetchProducts;
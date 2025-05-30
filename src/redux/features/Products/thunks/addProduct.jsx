import { createAsyncThunk } from "@reduxjs/toolkit";
import DjangoConfig from "../../../../config/config";
import axios from "axios";


const addProduct = createAsyncThunk(
    "products/addProduct",
    async (formData,{rejectWithValue}) => {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
  
      try {
        const response = await fetch(`${DjangoConfig.apiUrl}/main/product/`, {
          method: "POST",
          body: form,
        });
    
        if (!response.ok) {
          throw new Error("Failed to add product");
        }
        const data = await response.json(); // Parse the JSON response
        return data;
      } catch (error) {
        return rejectWithValue(error.response?.data || { error: "Something went wrong" });
      }
    }
  )
  export default addProduct;
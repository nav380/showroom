import { createAsyncThunk } from "@reduxjs/toolkit";
import DjangoConfig from "../../../../config/config";



const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    const form = new FormData();
    for (const key in formData) {
      if (!(key.includes("image") && typeof formData[key] === "string")) {
        form.append(key, formData[key]);
      } 

    }

    try {
      const response = await fetch(
        `${DjangoConfig.apiUrl}/main/product/${id}/`,
        {
          method: "PUT", 
          body: form,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      const data = await response.json(); // Parse the JSON response
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: "Something went wrong" });
     
    }
  }
)
export default editProduct;

import { createAsyncThunk } from "@reduxjs/toolkit";
import DjangoConfig from "../../../../config/config";



const patchProduct = createAsyncThunk(
    "products/patchProduct",
    async ({ id, formData },{rejectWithValue}) => {
        const form = new FormData();
        for (const key in formData) {

            form.append(key, formData[key]);


        }

        try {
            const response = await fetch(
                `${DjangoConfig.apiUrl}/main/product/${id}/`,
                {
                    method: "PATCH",
                    body: form,
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update product");
            }
            
            const data = await response.json(); // Parse the JSON response
            return data;
        } catch (error) {
           return rejectWithValue(error);
        }
    }
)
export default patchProduct;

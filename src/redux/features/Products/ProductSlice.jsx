import { createSlice } from "@reduxjs/toolkit";
import editProduct from "./thunks/editProduct";
import addProduct from "./thunks/addProduct";
import fetchProducts from "./thunks/fetchProducts";
import patchProduct from "./thunks/patchProduct";
import dummy from "../../../../dummy";





const productSlice = createSlice({
  name: "products",
  initialState: {
    items: dummy,
    status: "idle",
    error: null,
  },
  reducers: {
    clearProducts(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);

      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(patchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchProduct.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })
      .addCase(patchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });






  },
});


export default productSlice.reducer;

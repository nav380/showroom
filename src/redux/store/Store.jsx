

import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/Products/ProductSlice';
import cartReducer from '../features/Cart/cartSlice';


const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./sliders/userSlider";
import productReducer from "./sliders/productSlider";
import orderReducer from "./sliders/orderSlider";


export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    order: orderReducer
  },
});

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./sliders/counterSlider";
import userReducer from "./sliders/userSlider";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});

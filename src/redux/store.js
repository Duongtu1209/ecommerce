import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './sliders/counterSlider'

export const store = configureStore({
    reducer: {
      counter: counterReducer
    },
  })
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isDelivered: false,
  deliveredAt: "",
};

export const cartSlide = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { cartItem } = action.payload;
      const item = state?.cartItems?.find(
        (item) => item?.product === cartItem.product
      );

      if (item) {
        item.quantity += item?.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
    },
    increaseQuantity: (state, action) => {
      const { id } = action.payload;
      const cartItem = state?.cartItems?.find((item) => item?.product === id);

      cartItem.quantity++;
    },
    removeItem: (state, action) => {
      const { id } = action.payload;
      const cartItem = state?.cartItems?.filter((item) => item?.product !== id);
      state.cartItems = cartItem;
    },
    decreaseQuantity: (state, action) => {
      const { id } = action.payload;
      const cartItem = state?.cartItems?.find((item) => item?.product === id);
      cartItem.quantity--;
    },

    removeAll: (state, action) => {
      const { ids } = action.payload;
      const items = state?.cartItems?.filter(
        (item) => !ids.includes(item?.product)
      );
      state.cartItems = items;
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  removeAll,
} = cartSlide.actions;

export default cartSlide.reducer;

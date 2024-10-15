import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartItemsSelected:[],
  shippingAddress: {},
  paymentMethod: "",
  shippingMethod: "",
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
      const cartItemSelected = state?.cartItemsSelected?.find(
        (item) => item?.product === id
      );
      cartItem.quantity++;
      if (cartItemSelected) {
        cartItemSelected.quantity++;
      }
    },
    removeItem: (state, action) => {
      const { id } = action.payload;
      const cartItem = state?.cartItems?.filter((item) => item?.product !== id);
      const cartItemSelected = state?.cartItems?.filter(
        (item) => item?.product !== id
      );
      
      state.cartItems = cartItem;
      if (cartItemSelected) {
        state.cartItemsSelected = cartItemSelected;
      }
    },
    decreaseQuantity: (state, action) => {
      const { id } = action.payload;
      const cartItem = state?.cartItems?.find((item) => item?.product === id);
      const cartItemSelected = state?.cartItemsSelected?.find(
        (item) => item?.product === id
      );
      cartItem.quantity--;
      if (cartItemSelected) {
        cartItemSelected.quantity--;
      }
    },

    removeAll: (state, action) => {
      const { ids } = action.payload;
      const items = state?.cartItems?.filter(
        (item) => !ids.includes(item?.product)
      );
      const itemsSelected = state?.cartItemsSelected?.filter(
        (item) => !ids.includes(item?.product)
      );
      state.cartItems = items;
      if (itemsSelected) {
        state.cartItemsSelected = itemsSelected;
      }
    },

    selectedCart: (state, action) => {
      const {ids} = action.payload;
      const items = [];
      state?.cartItems?.forEach((item) => {
        if (ids?.includes(item?.product)) {
          items.push(item);
        }
      })
      state.cartItemsSelected = items;   
    }
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  removeAll,
  selectedCart
} = cartSlide.actions;

export default cartSlide.reducer;

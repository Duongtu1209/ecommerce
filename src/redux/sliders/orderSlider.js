import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
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

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (itemOrder) {
        itemOrder.quantity += orderItem?.quantity;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    removeItem: (state, action) => {
      const { id } = action.payload;
      const itemOrder = state?.orderItems?.find((item) => item?.product !== id);
      itemOrder.orderItems = itemOrder;
    },
  },
});

export const { addItem } = orderSlide.actions;

export default orderSlide.reducer;

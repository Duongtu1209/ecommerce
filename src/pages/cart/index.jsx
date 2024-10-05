import { Checkbox, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "../../components/Button/Button";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperTotal,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../components/ProductDetail/style";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeAll,
  removeItem,
  selectedCart,
} from "../../redux/sliders/cartSlider";
import { convertPrice } from "../../services/utils";


const calculateShippingFee = (totalPrice) => {
  const shippingFees = [
    { minPrice: 1, maxPrice: 5000000, fee: 50000 }, 
    { minPrice: 5000001, maxPrice: 10000000, fee: 30000 },
    { minPrice: 10000001, maxPrice: 20000000, fee: 20000 },
    { minPrice: 20000001, maxPrice: Infinity, fee: 0 }, 
  ];

  const applicableFee = shippingFees.find(
    (fee) => totalPrice >= fee.minPrice && totalPrice <= fee.maxPrice
  );

  return applicableFee ? applicableFee.fee : 0;
};

const Cart = () => {
  const cart = useSelector((state) => state?.cart);
  const [listChecked, setListChecked] = useState([]);
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };
  const dispatch = useDispatch();
  const handleChangQuantity = (type, cart) => {
    const { product, quantity } = cart;
    if (type === "increase") {
      dispatch(increaseQuantity({ id: product }));
    } else {
      if (quantity <= 1) {
        message.error("Số lượng sản phẩm không thể nhỏ hơn 1");
      } else {
        dispatch(decreaseQuantity({ id: product }));
      }
    }
  };

  const handleDeleteItem = (id) => {
    dispatch(removeItem({ id }));
  };
  const handleOnChangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      cart?.cartItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedCart({ids : listChecked})) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listChecked])

  const subTotal = useMemo(() => {
    const result = cart?.cartItemsSelected?.reduce((total, cur) => {
      return total + cur?.price * cur?.quantity;
    }, 0);
    return result;
  }, [cart]);

  const totalDiscount = useMemo(() => {
    const result = cart?.cartItemsSelected?.reduce((total, cur) => {
      const itemDiscount = (cur?.price * cur?.discount * cur?.quantity) / 100;
      return total + itemDiscount;
    }, 0);
    return result || 0;
  }, [cart]);

  const grandTotal = useMemo(() => {
    return subTotal - totalDiscount;
  }, [subTotal, totalDiscount]);

  const shippingFee = useMemo(
    () => calculateShippingFee(grandTotal),
    [grandTotal]
  );

  const handleRemoveAll = () => {
    if (listChecked?.length > 0) {
      dispatch(removeAll({ ids: listChecked }));
    }
  };

  return (
    <div
      style={{
        paddingTop: 10,
        background: "#f5f5fa",
        width: "100%",
        minHeight: "100vh",
        height: "100%",
      }}
    >
      <div style={{ height: "100%", width: 1600, margin: "0 auto" }}>
        <h3>Gio hang</h3>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: 500 }}>
                <Checkbox
                  onChange={handleOnChangeCheckAll}
                  checked={listChecked?.length === cart?.cartItems?.length}
                ></Checkbox>
                <span> Tất cả ({cart?.cartItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAll}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {cart?.cartItems?.map((item) => {
                return (
                  <WrapperItemOrder>
                    <div
                      style={{
                        width: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Checkbox
                        onChange={onChange}
                        value={item?.product}
                        checked={listChecked.includes(item?.product)}
                      ></Checkbox>
                      <a href={`/product-detail/${item.product}`}>
                        <img
                          src={item?.image}
                          style={{
                            width: 77,
                            height: 79,
                            objectFit: "cover",
                          }}
                          alt={item?.image?.alt}
                        />
                      </a>

                      <div
                        style={{
                          marginRight: 20,
                          width: "calc(100% - 100px)",
                        }}
                      >
                        {item?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        {item?.discount > 0 ? (
                          <>
                            <span style={{ fontSize: 15, color: "#252525" }}>
                              {convertPrice(
                                item?.price * (1 - item?.discount / 100)
                              )}
                            </span>
                            <span
                              style={{
                                fontSize: 15,
                                color: "#252525",
                                textDecoration: "line-through",
                              }}
                            >
                              {convertPrice(item?.price)}
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: 15, color: "#252525" }}>
                            {convertPrice(item?.price)}
                          </span>
                        )}
                      </span>
                      <WrapperCountOrder>
                        <button
                          onClick={() => handleChangQuantity("decrease", item)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                            size="10"
                          />
                        </button>
                        <WrapperInputNumber
                          value={item?.quantity}
                          size="small"
                        />
                        <button
                          onClick={() => handleChangQuantity("increase", item)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "20px" }}
                            size="10"
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        {item?.discount > 0 ? (
                          <>
                            <span
                              style={{
                                fontSize: 15,
                                color: "rgb(255, 66, 78)",
                                fontWeight: 500,
                              }}
                            >
                              {convertPrice(
                                item?.price *
                                  item?.quantity *
                                  (1 - item?.discount / 100)
                              )}
                            </span>
                            <span
                              style={{
                                fontSize: 15,
                                color: "rgb(255, 66, 78)",
                                fontWeight: 500,
                                textDecoration: "line-through",
                              }}
                            >
                              {convertPrice(item?.price * item?.quantity)}
                            </span>
                          </>
                        ) : (
                          <span
                            style={{
                              fontSize: 15,
                              color: "rgb(255, 66, 78)",
                              fontWeight: 500,
                            }}
                          >
                            {convertPrice(item?.price * item?.quantity)}
                          </span>
                        )}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteItem(item?.product)}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{ color: "#000", fontSize: 15, fontWeight: "bold" }}
                  >
                    {convertPrice(subTotal)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span> Giảm giá </span>
                  <span
                    style={{
                      color: "rgb(255, 66, 78)",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(totalDiscount)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <span
                    style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}
                  >
                    {convertPrice(shippingFee)}
                  </span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(grandTotal)}
                  </span>
                  <span style={{ color: "#000", fontSize: 11 }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <div style={{ width: '100%' }}>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "rgb(255, 57, 69)",
                  height: 48,
                  width: '100%',
                  border: "none",
                  borderRadius: 4,
                  fontWeight: "bold",
                  color: "#fff",
                  textTransform: "uppercase",
                }}
                textbutton="Thanh Toán"
              />
            </div>
          </WrapperRight>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import { Checkbox, message } from "antd";
import React, { useState } from "react";
import ButtonComponent from "../../components/Button/Button";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperPriceDiscount,
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
} from "../../redux/sliders/cartSlider";

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
              <span style={{ display: "inline-block", width: 600 }}>
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
                        width: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginRight: 10,
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
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
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
                      <span>
                        <span style={{ fontSize: 13, color: "#252525" }}>
                          {item?.price?.toLocaleString()}
                        </span>
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
                        style={{
                          color: "rgb(255, 66, 78)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {(item?.price * item?.quantity)?.toLocaleString}
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
                    style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span> Giảm giá</span>
                  <span
                    style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span> Thuế </span>
                  <span
                    style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}
                  ></span>
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
                    0
                  </span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "rgb(254, 56, 52)", fontSize: 24 }}>
                    500
                  </span>
                  <span style={{ color: "#000", fontSize: 11 }}>
                    (Đã bao gồm VAT nếu có)
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: 48,
                width: 220,
                border: "none",
                borderRadius: 4,
              }}
              textbutton="Thanh Toán"
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
    </div>
  );
};

export default Cart;

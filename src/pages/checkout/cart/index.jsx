import { Checkbox, Form, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "../../../components/Button/Button";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperTotal,
  WrapperStyleHeaderDelivery,
} from "../style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../../components/ProductDetail/style";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeAll,
  removeItem,
  selectedCart,
} from "../../../redux/sliders/cartSlider";
import { convertPrice } from "../../../services/utils";
import { ModalComponent } from "../../../components/Modal/Modal";
import InputComponent from "../../../components/Input/Input";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as UserService from "../../../services/UserService";
import Loading from "../../../components/Loading/Loading";
import { updateUser } from "../../../redux/sliders/userSlider";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../../components/Step/Step";

const calculateShippingFee = (totalPrice) => {
  const shippingFees = [
    { minPrice: 1, maxPrice: 4999999, fee: 50000 },
    { minPrice: 5000000, maxPrice: 9999999, fee: 30000 },
    { minPrice: 10000000, maxPrice: 19999999, fee: 20000 },
    { minPrice: 20000000, maxPrice: Infinity, fee: 0 },
  ];

  const applicableFee = shippingFees.find(
    (fee) => totalPrice >= fee.minPrice && totalPrice <= fee.maxPrice
  );

  return applicableFee ? applicableFee.fee : 0;
};
const Cart = () => {
  const cart = useSelector((state) => state?.cart);
  const user = useSelector((state) => state?.user);
  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [listChecked, setListChecked] = useState([]);
  const navigate = useNavigate();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: user?.isAdmin || false,
    address: "",
    avatar: "",
    city: "",
    image: "",
  });
  const [form] = Form.useForm();

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
    dispatch(selectedCart({ ids: listChecked }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isModalUpdateInfo) {
      setStateUserDetails({
        ...user,
        email: user?.email,
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalUpdateInfo, user]);

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

  const shippingFee = useMemo(() => calculateShippingFee(subTotal), [subTotal]);

  const grandTotal = useMemo(() => {
    return subTotal - totalDiscount + shippingFee;
  }, [subTotal, totalDiscount, shippingFee]);

  const handleRemoveAll = () => {
    if (listChecked?.length > 0) {
      dispatch(removeAll({ ids: listChecked }));
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const handleGoToCheckout = () => {
    if (!cart?.cartItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm thanh toán");
    } else if (!user?.phone || !user?.name || !user?.address || !user?.city) {
      setIsModalUpdateInfo(true);
    } else {
      navigate("/checkout/payment");
    }
  };

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      city: "",
    });
    form.resetFields();
    setIsModalUpdateInfo(false);
  };

  const handleUpdateUserInfo = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?._id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            message.success("Cập nhật thông tin giao hàng thành công");
            dispatch(updateUser({ name, address, city, phone }));
            setIsModalUpdateInfo(false);
          },
        }
      );
    }
  };
  const { isPending } = mutationUpdate;

  const handleInputChangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const stepItems = [
    {
      title: "50.000 VND",
      description: "Mua",
    },
    {
      title: "30.000 VND",
      description: "Trên 5.0000.000 VND",
    },
    {
      title: "20.000 VND",
      description: "Trên 10.000.000 VND",
    },
    {
      title: "0 VND",
      description: "Trên 20.000.000 VND",
    },
  ];

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
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <WrapperLeft>
            <WrapperStyleHeaderDelivery>
              <StepComponent
                items={stepItems}
                current={
                  shippingFee === 30000 && listChecked.length > 0
                    ? 1
                    : shippingFee === 20000 && listChecked.length > 0
                    ? 2
                    : shippingFee === 0 && listChecked.length > 0
                    ? 3
                    : 0
                }
              />
            </WrapperStyleHeaderDelivery>
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
                <div>
                  <span>Địa chỉ:</span>
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "rgb(37, 37, 37)",
                        textDecoration: "underline",
                      }}
                    >{`${user?.address} ${user?.city}`}</span>
                    <span
                      style={{ color: "rgb(10, 104, 255)", cursor: "pointer" }}
                      onClick={() => setIsModalUpdateInfo(true)}
                    >
                      Đổi
                    </span>
                  </div>
                </div>
              </WrapperInfo>
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
            <div style={{ width: "100%" }}>
              <ButtonComponent
                onClick={() => handleGoToCheckout()}
                size={40}
                styleButton={{
                  background: "rgb(255, 57, 69)",
                  height: 48,
                  width: "100%",
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
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateUserInfo}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails?.name}
                onChange={handleInputChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                value={stateUserDetails?.email}
                onChange={handleInputChangeDetails}
                name="email"
                readOnly
                disabled
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <InputComponent
                value={stateUserDetails?.phone}
                onChange={handleInputChangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails?.address}
                onChange={handleInputChangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <InputComponent
                value={stateUserDetails?.city}
                onChange={handleInputChangeDetails}
                name="city"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default Cart;

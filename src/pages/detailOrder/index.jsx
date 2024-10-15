import React, {useMemo, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import { orderConst } from "../../const";
import { convertPrice } from "../../services/utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStyleHeader,
} from "../myOrder/style";
import {
  Label,
  WrapperContainer,
  WrapperInfo,
  WrapperValue,
} from "../checkout/style";
import ButtonComponent from "../../components/Button/Button";
import {useMutationHook} from "../../hooks/useMutationHook";
import {message} from "antd";
import {useSelector} from "react-redux";
import {ModalComponent} from "../../components/Modal/Modal";

const fetchDetailsOrder = async (token, id) => {
  try {
    const res = await OrderService.getOrderDetail(token, id);
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch order details.");
  }
};

const DetailOrder = () => {
  const user = useSelector((state) => state?.user);
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { state } = location;
  const { id } = params;
  const queryOrder = useQuery({
    queryKey: ["order-details", id],
    queryFn: () => fetchDetailsOrder(state?.token, id),
    enabled: !!state?.token && !!id,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const { isPending, data } = queryOrder;

  const cancelOrderMutation = useMutationHook((data) => {
    const { id, token } = data;
    return OrderService.cancelOrder(token, id);
  });

  const showCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const handleConfirmCancelOrder = () => {
    cancelOrderMutation.mutate(
        { id: selectedOrderId, token: state?.token },
        {
          onSuccess: () => {
            message.success("Đơn hàng đã được hủy thành công");
            navigate("/my-order", {
              state: {
                id: user?._id,
                token: user?.access_token,
              },
            });
          },
          onError: () => {
            message.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
          },
        }
    );
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const {isLoading: isLoadingCancel} = cancelOrderMutation

  const totalQuantity = useMemo(() => {
    return (
      data?.orderItems?.reduce((total, item) => total + item.quantity, 0) || 0
    );
  }, [data]);

  const shippingFeePerItem = useMemo(() => {
    return totalQuantity ? data?.shippingFee / totalQuantity : 0;
  }, [data?.shippingFee, totalQuantity]);

  return (
    <Loading isPending={isPending}>
      <div
        style={{
          width: "100%",
          height: "100%",
          paddingBottom: 120,
          background: "#f5f5fa",
          paddingTop: 20,
        }}
      >
        <div style={{ height: "100%", width: 1600, margin: "0 auto" }}>
          <h4>Chi tiết đơn hàng</h4>
          <WrapperContainer>
            <WrapperInfo style={{ marginTop: 12 }}>
              <div>
                <Label>Địa chỉ người nhận</Label>
                <WrapperValue>
                  <div className="name-info">
                    {data?.shippingAddress?.fullName}
                  </div>
                  <div className="address-info">
                    <span>Địa chỉ: </span>
                    {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                  </div>
                  <div className="phone-info">
                    <span>Điện thoại: </span>
                    {`${data?.shippingAddress?.phone}`}
                  </div>
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo style={{ marginTop: 12 }}>
              <div>
                <Label>Phương thức giao hàng</Label>
                <WrapperValue>
                  {orderConst.delivery[data?.shippingMethod] === "FAST" ? (
                    <span
                      style={{
                        color: "#ea8500",
                        fontWeight: "bold",
                        marginRight: 10,
                      }}
                    >
                      FAST
                      <span
                        style={{
                          color: "#252525",
                          fontWeight: "normal",
                          marginLeft: 10,
                        }}
                      >
                        Giao hàng hoả tốc
                      </span>
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "#ea8500",
                        fontWeight: "bold",
                        marginRight: 10,
                      }}
                    >
                      GO-JEK
                      <span
                        style={{
                          color: "#252525",
                          fontWeight: "normal",
                          marginLeft: 10,
                        }}
                      >
                        Giao hàng tiết kiệm
                      </span>
                    </span>
                  )}
                  <div className="delivery-fee">
                    <span>Phí giao hàng: </span>
                    {convertPrice(data?.shippingFee)}
                  </div>
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo style={{ marginTop: 12 }}>
              <div>
                <Label>Phương thức thanh toán</Label>
                <WrapperValue>
                  <span style={{ color: "#252525" }}>
                    {orderConst.payment[data?.paymentMethod]}
                  </span>
                  <div className="payment-pay">
                    <span>Trạng thái: </span>
                    {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </div>
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo style={{ marginTop: 12 }}>
              <WrapperStyleHeader>
                <span style={{ display: "inline-block", width: 500 }}>
                  <span> Sản phẩm</span>
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
                  <span>Giảm giá</span>
                  <span>Phí vận chuyển</span>
                  <span>Thành tiền</span>
                </div>
              </WrapperStyleHeader>
              <WrapperListOrder style={{ marginTop: 0 }}>
                {data?.orderItems?.map((item) => {
                  return (
                    <WrapperItemOrder key={item.product}>
                      <div
                        style={{
                          width: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <a href={`/product-detail/${item?.product}`}>
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
                        <span
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontSize: 15, color: "#252525" }}>
                            {item?.quantity}
                          </span>
                        </span>
                        <span
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontSize: 15, color: "#252525" }}>
                            {convertPrice(
                              item?.price -
                                item?.price * (1 - item?.discount / 100)
                            )}
                          </span>
                        </span>
                        <span
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span style={{ fontSize: 15, color: "#252525" }}>
                            {convertPrice(shippingFeePerItem * item.quantity)}
                          </span>
                        </span>
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
                                    (1 - item?.discount / 100) +
                                    shippingFeePerItem * item.quantity
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
                                {convertPrice(
                                  item?.price * item?.quantity +
                                    shippingFeePerItem * item.quantity
                                )}
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
                              {convertPrice(
                                item?.price * item?.quantity +
                                  shippingFeePerItem * item.quantity
                              )}
                            </span>
                          )}
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperListOrder>
            </WrapperInfo>
            <WrapperInfo>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  Tổng tiền
                </span>
                <span
                  style={{
                    fontSize: 30,
                    color: "rgb(255, 66, 78)",
                    fontWeight: 700,
                  }}
                >
                  {convertPrice(data?.grandTotal)}
                </span>
              </div>
            </WrapperInfo>
            {!data?.isDelivered && (
                <WrapperInfo style={{ marginTop: 12 }}>
                  <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 20,
                      }}
                  >
                    <ButtonComponent
                        onClick={() => showCancelModal(data?._id)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid rgb(11, 116, 229)",
                          borderRadius: 4,
                        }}
                        textbutton={
                          isLoadingCancel ? "Đang hủy..." : "Hủy đơn hàng"
                        }
                        styleTextButton={{
                          color: "rgb(11, 116, 229)",
                          fontSize: 14,
                        }}
                        disabled={isLoadingCancel}

                    ></ButtonComponent>
                  </div>
                </WrapperInfo>
            )}
          </WrapperContainer>
        </div>
        <ModalComponent
            title="Hủy đơn hàng"
            open={isModalVisible}
            onCancel={handleCancel}
            onOk={handleConfirmCancelOrder}
        >
            <div>Bạn chắc chắn muốn hủy đơn hàng này ?</div>
        </ModalComponent>
      </div>
    </Loading>
  );
};

export default DetailOrder;

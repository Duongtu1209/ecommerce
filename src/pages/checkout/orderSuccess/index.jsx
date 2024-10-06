import React from "react";
import {
  Label,
  WrapperContainer,
  WrapperInfo,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStyleHeader,
  WrapperValue,
} from "../style";
import { useLocation } from "react-router-dom";
import { orderConst } from "../../../const";
import { convertPrice } from "../../../services/utils";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
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
        <h3>Đơn đặt hàng thành công</h3>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <WrapperContainer>
            <WrapperInfo>
              <div>
                <Label>Phương thức giao hàng</Label>
                <WrapperValue>
                  {orderConst.delivery[state?.delivery] === "fast" ? (
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
                </WrapperValue>
              </div>
            </WrapperInfo>
            <WrapperInfo style={{ marginTop: 12 }}>
              <div>
                <Label>Phương thức thanh toán</Label>
                <WrapperValue>
                  <span style={{ color: "#252525", fontSize: 14 }}>
                    {orderConst.payment[state?.payment]}
                  </span>
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
                  <span>Thành tiền</span>
                </div>
              </WrapperStyleHeader>
              <WrapperListOrder style={{ marginTop: 0 }}>
                {state?.order?.map((item) => {
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
                  {convertPrice(state?.grandTotal)}
                </span>
              </div>
            </WrapperInfo>
          </WrapperContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

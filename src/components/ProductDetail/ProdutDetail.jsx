import { Col, Image, Row } from "antd";
import React from "react";
import imageProduct from "../../assets/images/thumbnail.webp";
import imageSmall from "../../assets/images/thumbnailSmall.webp";
import {
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleProductName,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
} from "./style";

import { StarFilled, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/Button/Button";

const ProductDetail = () => {
  const onChange = () => {};
  return (
    <Row style={{ padding: `16px`, background: `#fff`, borderRadius: 4 }}>
      <Col
        span={10}
        style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
      >
        <Image src={imageProduct} alt="image product" preview="false" />
        <Row style={{ padding: `10px`, justifyContent: "space-between" }}>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={imageSmall}
              alt="image small"
              preview="false"
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={imageSmall}
              alt="image small"
              preview="false"
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={imageSmall}
              alt="image small"
              preview="false"
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={imageSmall}
              alt="image small"
              preview="false"
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={imageSmall}
              alt="image small"
              preview="false"
            />
          </WrapperStyleColImage>
          <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall
              src={imageSmall}
              alt="image small"
              preview="false"
            />
          </WrapperStyleColImage>
        </Row>
      </Col>
      <Col span={14} style={{ paddingLeft: "10px" }}>
        <WrapperStyleProductName>Apple iPhone 13</WrapperStyleProductName>
        <div>
          <StarFilled
            style={{ fontSize: `12px`, color: `rgb(255, 196, 0)` }}
          ></StarFilled>
          <StarFilled
            style={{ fontSize: `12px`, color: `rgb(255, 196, 0)` }}
          ></StarFilled>
          <StarFilled
            style={{ fontSize: `12px`, color: `rgb(255, 196, 0)` }}
          ></StarFilled>
          <WrapperStyleTextSell>| Da ban 1000+</WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>200.000</WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <WrapperAddressProduct
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0 20px",
          }}
        >
          <div>
            <span> Giao đến </span>
            <span className="address">Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội</span>
          </div>
          <div>
            <span className="change-address">Đổi</span>
          </div>
        </WrapperAddressProduct>
        <div
          style={{
            margin: "10px 0 20px",
            padding: "10px 0",
          }}
        >
          <div style={{ marginBottom: "6px", fontWeight: "700" }}>
            {" "}
            Số Lượng{" "}
          </div>
          <WrapperQualityProduct>
            <button style={{ border: "none", background: "transparent" }}>
              <MinusOutlined
                style={{ color: "#000", fontSize: "20px" }}
                size="10"
              />
            </button>
            <WrapperInputNumber
              defaultValue={3}
              onChange={onChange}
              size="small"
            />
            <button style={{ border: "none", background: "transparent" }}>
              <PlusOutlined
                style={{ color: "#000", fontSize: "20px" }}
                size="10"
              />
            </button>
          </WrapperQualityProduct>
        </div>
        <div style={{ display: "flex", alignContent: "center", gap: "12px" }}>
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "rgb(255, 66, 78)",
              height: "48px",
              width: "220px",
              border: "none",
              borderRadius: "4px",
            }}
            styleTextButton={{ color: "#fff", fontSize: "16px" }}
            textbutton={"Mua ngay"}
          />
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "#fff",
              height: "48px",
              width: "220px",
              border: "1px solid rgb(10, 104, 255)",
              borderRadius: "4px",
            }}
            styleTextButton={{ color: "rgb(10, 104, 255)", fontSize: "16px" }}
            textbutton={"Mua trả góp - trả sau"}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetail;

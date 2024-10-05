import { Col, Image, message, Rate, Row } from "antd";
import React, { useState } from "react";
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

import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../../components/Button/Button";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addItem } from "../../redux/sliders/cartSlider";

const ProductDetailComponent = ({ id }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const onChange = (value) => {
    setQuantity(Number(value));
  };
  const fetchDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res?.data;
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchDetailsProduct,
    enabled: !!id,
  });

  const handleChangQuantity = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity <= 1) {
        message.error("Số lượng sản phẩm không thể nhỏ hơn 1");
      } else {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    if (!user?._id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addItem({
          cartItem: {
            name: productDetails?.name,
            quantity: quantity,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
          },
        })
      );
    }
  };

  return (
    <Loading isPending={isPending}>
      <Row style={{ padding: `16px`, background: `#fff`, borderRadius: 4 }}>
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview="false"
          />
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
          <WrapperStyleProductName>
            {productDetails?.name}
          </WrapperStyleProductName>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
              disabled
            />
            <WrapperStyleTextSell>| Da ban 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {productDetails?.price?.toLocaleString()}
            </WrapperPriceTextProduct>
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
              <span className="address">{user?.address}</span>
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
              <button
                onClick={() => handleChangQuantity("decrease")}
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
                onChange={onChange}
                value={quantity}
                size="small"
              />
              <button
                onClick={() => handleChangQuantity("increase")}
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
              onClick={handleAddToCart}
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
    </Loading>
  );
};

export default ProductDetailComponent;

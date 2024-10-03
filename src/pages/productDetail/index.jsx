import React from "react";
import ProductDetailComponent from "../../components/ProductDetail/ProdutDetail";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{
        paddingTop: 10,
        background: `#efefef`,
        minHeight: "100vh",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ width: 1600, height: '100%', margin: '0 auto'}}>
        <h5>
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => {
              navigate("/");
            }}
          >
            Trang chủ {" "}
          </span>
          {"> Chi tiết sản phẩm"}
        </h5>
        <div style={{ display: "flex", background: `#fff` }}>
          <ProductDetailComponent id={id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

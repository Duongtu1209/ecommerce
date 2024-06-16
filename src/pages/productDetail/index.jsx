import React from "react";
import ProductDetail from "../../components/ProductDetail/ProdutDetail";

const productDetail = () => {
  return (
    <div style={{ padding: `0 120px`, background: `#efefef` }}>
      <h5>Trang chu</h5>
      <div style={{display: 'flex', background: `#fff`}}>
        <ProductDetail />
      </div>
    </div>
  );
};

export default productDetail;

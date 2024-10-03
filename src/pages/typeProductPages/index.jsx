import React, { useEffect, useState } from "react";
import NavBar from "../../components/Navbar/Navbar";
import { Row, Col, Pagination } from "antd";
import CardComponent from "../../components/Card/Card";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation, useParams } from "react-router-dom"; // Import useParams
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/Loading/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useSelector } from "react-redux";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const { state } = useLocation();
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const normalizeType = (type) => {
    return type.replace(/_/g, " ");
  };

  const fetchProductType = async (productType, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(productType, page, limit);
    if (res?.status === "OK") {
      setProducts(res?.data);
      setPanigate((prev) => ({ ...prev, total: res?.data?.length }));
    }
    setLoading(false);
  };

  console.log(state, normalizeType(type));
  

  useEffect(() => {
    const productType = state || normalizeType(type);
    if (productType) {
      fetchProductType(productType, panigate.page, panigate.limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, type]);

  useEffect(() => {
    const productType = state || normalizeType(type);
    if (productType) {
      fetchProductType(productType, panigate.page, panigate.limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current, limit: pageSize });
  };

  return (
    <Loading isPending={loading}>
      <div
        style={{
          width: "100%",
          background: `#efefef`,
          minHeight: "calc(100vh - 64px)",
          height: "100%",
          paddingBottom: 120,
        }}
      >
        <div
          style={{
            width: 1600,
            margin: `0 auto`,
            height: "100%",
          }}
        >
          <Row
            style={{
              flexWrap: `nowrap`,
              paddingTop: `10px`,
              height: "100%",
            }}
          >
            <WrapperNavbar span={4}>
              <NavBar />
            </WrapperNavbar>
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 30,
              }}
            >
              <WrapperProducts>
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return pro;
                    } else if (
                      pro?.name
                        ?.toLowerCase()
                        .includes(searchDebounce?.toLocaleLowerCase())
                    ) {
                      return pro;
                    }
                  })
                  ?.map((product) => {
                    return (
                      <CardComponent
                        key={product._id}
                        quantity={product.quantity}
                        description={product.description}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        type={product.type}
                        rating={product.rating}
                        discount={product.discount}
                        selled={product.selled}
                        id={product._id}
                      />
                    );
                  })}
              </WrapperProducts>
              <Pagination
                current={panigate?.page}
                total={panigate?.total}
                onChange={onChange}
                style={{ textAlign: "center", marginTop: "10px" }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;

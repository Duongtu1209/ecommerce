import React, { useEffect, useState } from "react";
import { Row, Col, Pagination } from "antd";
import CardComponent from "../../components/Card/Card";
import { WrapperProducts } from "./style";
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
  const [paginate, setPaginate] = useState({
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
      setPaginate((prev) => ({ ...prev, total: res?.data?.length }));
    }
    setLoading(false);
  };

  useEffect(() => {
    const productType = state || normalizeType(type);
    if (productType) {
      fetchProductType(productType, paginate.page, paginate.limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, type]);

  useEffect(() => {
    const productType = state || normalizeType(type);
    if (productType) {
      fetchProductType(productType, paginate.page, paginate.limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginate.page, paginate.limit]);

  const onChange = (current, pageSize) => {
    setPaginate({ ...paginate, page: current, limit: pageSize });
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
            width: '100%',
            padding: `0 120px`,
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
            <Col
              span={35}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                gap: 30,
              }}
            >
              <WrapperProducts>
                {products
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return true;
                    } else if (
                      pro?.name
                        ?.toLowerCase()
                        .includes(searchDebounce?.toLocaleLowerCase())
                    ) {
                      return true;
                    }
                    return false;
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
                        sold={product.sold}
                        id={product._id}
                      />
                    );
                  })}
              </WrapperProducts>
              <Pagination
                current={paginate?.page}
                total={paginate?.total}
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

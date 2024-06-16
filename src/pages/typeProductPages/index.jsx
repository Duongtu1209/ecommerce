import React from "react";
import NavBar from "../../components/Navbar/Navbar";
import { Row, Col, Pagination } from "antd";
import CardComponent from "../../components/Card/Card";
import { WrapperNavbar, WrapperProducts } from "./style";

const TypeProductPage = () => {
  const onChange = () => {};
  return (
    <div
      style={{
        width: "100%",
        background: `#efefef`,
      }}
    >
      {" "}
      <div
        style={{
          width: 1600,
          margin: `0 auto`,
        }}
      >
        <Row
          style={{
            flexWrap: `nowrap`,
            paddingTop: `10px`,
          }}
        >
          <WrapperNavbar span={4}>
            <NavBar />
          </WrapperNavbar>
          <Col span={20}>
            <WrapperProducts>
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </WrapperProducts>
            <Pagination
              defaultCurrent={2}
              total={500}
              onChange={onChange}
              style={{ textAlign: "center", marginTop: "10px" }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TypeProductPage;

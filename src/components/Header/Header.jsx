import { Badge, Col } from "antd";
import React from "react";
import {
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Search from "../Button/Search";
import { useNavigate } from "react-router-dom";

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const nav = useNavigate();

  const handleNavigateLogin = () => {
    nav("/sign-in");
  };

  return (
    <div
      style={{
        heiht: "100%",
        width: "100%",
        display: "flex",
        background: "#4096ff",
        justifyContent: "center",
      }}
    >
      <WrapperHeader
        style={{
          justifyContent:
            isHiddenSearch && isHiddenSearch ? "space-between" : "unset",
        }}
      >
        <Col span={3}>
          <WrapperTextHeader to="/">{"E-Commerce PT"}</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <Search
              size="large"
              textbutton="Tìm kiếm"
              placeholder="input search text"
              backgroundColorButton="#5a20c1"
            />
          </Col>
        )}
        <Col
          span={6}
          style={{
            display: "flex",
            gap: "54px",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: "30px" }} />
            <div style={{ cursor: "pointer" }} onClick={handleNavigateLogin}>
              <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccount>
          {!isHiddenCart && (
            <div style={{ cursor: "pointer" }}>
              <Badge size="small" count={4}>
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                />
              </Badge>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default Header;

import { Badge, Col, Popover } from "antd";
import React, { useState } from "react";
import {
  WrapperContentPopup,
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
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService"
import { resetUser } from "../../redux/sliders/userSlider";
import Loading from "../Loading/Loading";

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const nav = useNavigate();
  const user = useSelector((state) => state.user)  
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const handleNavigateLogin = () => {
    nav("/sign-in");
  };
  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    localStorage.clear('access_token')
    dispatch(resetUser())
    setLoading(false)
  }
  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
      <WrapperContentPopup onClick={() => nav('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
    </div>
  )

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
        <Loading isPending={loading}>
          <WrapperHeaderAccount>
              <UserOutlined style={{ fontSize: "30px" }} />{
                user?.name ? (
                  <>
                    <Popover content={content} trigger="click">
                      <div style={{ cursor: "pointer" }}>{user.name}</div>
                    </Popover>
                  </>
                  ): (<div style={{ cursor: "pointer" }} onClick={handleNavigateLogin}>
                <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                <div>
                  <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                  <CaretDownOutlined />
                </div>
              </div>)
              }
            </WrapperHeaderAccount>
        </Loading>
          
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

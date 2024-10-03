import { Badge, Col, Popover } from "antd";
import React, { useEffect, useState } from "react";
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
import { searchProduct } from "../../redux/sliders/productSlider";

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const nav = useNavigate();
  const user = useSelector((state) => state.user)
  const [userName, setUserName] = useState('') 
  const [userAvatar, setUserAvatar] = useState('') 
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

  useEffect(() => {     
    setLoading(true)
    setUserName(user?.name) 
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [ user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
      <WrapperContentPopup onClick={() => nav('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && <WrapperContentPopup onClick={() => nav('/system/admin')}>Quản lí hệ thống</WrapperContentPopup>}
    </div>
  )

  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  }

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
              onChange={onSearch}
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
              {userAvatar ? (<img src={userAvatar} style={{
                            height: '30px',
                            width:'30px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }} alt='avatar'/>) : (<UserOutlined style={{ fontSize: "30px" }} />)}
              {
                user?.access_token ? (
                  <>
                    <Popover content={content} trigger="click">
                      <div style={{ cursor: "pointer" }}>{userName?.length ? userName : user?.email}</div>
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

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
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/sliders/userSlider";
import Loading from "../Loading/Loading";
import { searchProduct } from "../../redux/sliders/productSlider";

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const nav = useNavigate();
  const user = useSelector((state) => state?.user);
  const cart = useSelector((state) => state?.cart);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleNavigateLogin = () => {
    nav("/sign-in");
  };
  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.clear("access_token");
    dispatch(resetUser());
    nav("/");
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const handleClickNav = (type) => {
    switch (type) {
      case "profile":
        nav("/profile-user");
        break;
      case "admin":
        nav("/system/admin");
        break;
      case "my-order":
        nav(`/my-order`, {
          state: {
            id: user?._id,
            token: user?.access_token,
          },
        });
        break;
      case "logout":
        handleLogout();
        break;
      case 'change-password': 
        nav("/change-password");
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNav("profile")}>
        Thông tin người dùng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNav("change-password")}>
        Đổi mật khẩu
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNav("admin")}>
          Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNav("my-order")}>
        Đơn hàng của tôi
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNav("logout")}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  };

  return (
    <div
      style={{
        height: "100%",
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
              {userAvatar ? (
                <img
                  src={userAvatar}
                  style={{
                    height: "30px",
                    width: "30px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpen}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsOpen((prev) => !prev)}
                    >
                      {userName?.length ? userName : user?.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={handleNavigateLogin}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập/Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>

          {!isHiddenCart && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                nav("/checkout/cart");
              }}
            >
              <Badge size="small" count={cart?.cartItems?.length}>
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

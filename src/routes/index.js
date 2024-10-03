import Error404 from "../pages/404";
import Home from "../pages/home";
import Order from "../pages/order";
import Product from "../pages/products";
import SignIn from "../pages/signIn";
import SignUp from "../pages/signUp";
import ProductDetail from "../pages/productDetail";
import ProfileUser from "../pages/profile";
import TypeProductPages from "../pages/typeProductPages";
import Admin from "../pages/admin";

export const routes = [
  {
    path: "/",
    page: Home,
    isShowheader: true,
  },
  {
    path: "/order",
    page: Order,
    isShowheader: true,
  },
  {
    path: "/products",
    page: Product,
    isShowheader: true,
  },
  {
    path: "/sign-in",
    page: SignIn,
    isShowheader: false,
  },
  {
    path: "/sign-up",
    page: SignUp,
    isShowheader: false,
  },
  {
    path: "/product-detail/:id",
    page: ProductDetail,
    isShowheader: true,
  },
  {
    path: "/profile-user",
    page: ProfileUser,
    isShowheader: true,
  },
  {
    path: "/system/admin",
    page: Admin,
    isShowheader: false,
    isPrivate: true
  },
  {
    path: "product/:type",
    page: TypeProductPages,
    isShowheader: true,
  },
  {
    path: "*",
    page: Error404,
  },
];

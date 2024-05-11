import Error404 from "../pages/404"
import Home from "../pages/home"
import Order from "../pages/orders"
import Product from "../pages/products"
import TypeProductPages from "../pages/typeProductPages"

export const routes = [
    {
        path: '/',
        page: Home,
        isShowheader: true
    },
    {
        path: '/order',
        page: Order,
        isShowheader: true
    },
    {
        path: '/products',
        page: Product,
        isShowheader: true
    },
    {
        path: '/:type',
        page: TypeProductPages,
        isShowheader: true
    },
    {
        path: '*',
        page: Error404
    },
]
import React, { useEffect, useState } from "react";
import {
  WrapperTypeProduct,
  WrapperButtonMore,
  WrapperProducts,
} from "./style";
import TypeProduct from "../../components/Product/Type";
import SliderComponent from "../../components/Slider/Slider";
import blackFriday from "../../assets/images/blackFriday.jpg";
import muathu from "../../assets/images/muathu.jpg";
import lotus from "../../assets/images/lotus.jpg";
import sofa from "../../assets/images/sofa.jpg";
import CardComponent from "../../components/Card/Card";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const Home = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [typeProducts, setTypeProducts] = useState([])
  const [limit, setLimit] = useState(6);
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    setTypeProducts(res?.data);
  }

  const { isPending, data: products } = useQuery({
    queryKey: ["products", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    fetchAllTypeProduct()
  },[])

  return (
    <Loading isPending={isPending}>
      <WrapperTypeProduct>
        {typeProducts.map((item) => {
          return <TypeProduct name={item} key={item} />;
        })}
      </WrapperTypeProduct>
      <div
        id="container"
        style={{
          backgroundColor: "#efefef",
          padding: "0 120px 120px",
          height: "100%",
        }}
      >
        <SliderComponent arrImages={[blackFriday, muathu, lotus, sofa]} />
        <WrapperProducts>
          {products?.data?.map((product) => {
            return (
              <CardComponent
                key={product?._id}
                quantity={product?.quantity}
                description={product?.description}
                image={product?.image}
                name={product?.name}
                price={product?.price}
                type={product?.type}
                rating={product?.rating}
                discount={product?.discount}
                sold={product?.sold || null}
                id={product?._id}
              />
            );
          })}
        </WrapperProducts>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <WrapperButtonMore
            textbutton="Xem thêm"
            type="outline"
            styleButton={{
              marginTop: 30,
              border: "1px solid rgb(11, 116, 229)",
              color: `${
                products?.total === products?.data?.length
                  ? "#ccc"
                  : "rgb(11, 116, 229)"
              }`,
              width: 240,
              height: 38,
              borderRadius: 4,
            }}
            disabled={
              products?.total === products?.data?.length ||
              products?.totalPage === 1
            }
            styleTextButton={{
              fontWeight: 500,
              color: products?.total === products?.data?.length && "#fff",
            }}
            onClick={() => {
              if (
                !(
                  products?.total === products?.data?.length ||
                  products?.totalPage === 1
                )
              ) {
                setLimit((prev) => prev + 6);
              }
            }}
          />
        </div>
      </div>
    </Loading>
  );
};

export default Home;

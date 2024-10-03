import React, { useEffect, useRef, useState } from "react";
import { WrapperTypeProduct, WrapperButtonMore, WrapperProducts } from "./style";
import TypeProduct from "../../components/Product/Type";
import SliderComponent from "../../components/Slider/Slider";
import blackFriday from "../../assets/images/blackFriday.jpg";
import muathu from "../../assets/images/muathu.jpg";
import lotus from "../../assets/images/lotus.jpg";
import sofa from "../../assets/images/sofa.jpg";
import CardComponent from "../../components/Card/Card";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService"
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const Home = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const refSearch = useRef()
  const searchDebounce = useDebounce(searchProduct, 1000)
  const [pending, setPending] = useState(false)
  const [stateProducts, setStateProducts] = useState([])
  const arr = ["Television", "Laptop", "Phone"];
  const fetchProductAll = async (search) => {
    const res = await ProductService.getAllProduct(search)
    if (search?.length > 0 || refSearch.current) {
      setStateProducts(res?.data)
    } else {
       return res
    }
  } 

  
  useEffect(() => {
    if (refSearch.current) {
        setPending(true)
        fetchProductAll(searchDebounce)
    }
    refSearch.current = true
    setPending(false)
  },[searchDebounce])

  const {isPending, data: products} = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });    

  useEffect(() => {
    if (products?.data?.length > 0) {
      setStateProducts(products?.data)
    }
  }, [products])

  return (
    <Loading isPending={isPending || pending}>
      <WrapperTypeProduct>
        {arr.map((item) => {
          return <TypeProduct name={item} key={item} />;
        })}
      </WrapperTypeProduct>
      <div
        id="container"
        style={{ backgroundColor: "#efefef", padding: "0 120px", height: 1000 }}
      >
        <SliderComponent arrImages={[blackFriday, muathu, lotus, sofa]} />
        <WrapperProducts>
          {stateProducts?.map((product) => {
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
              />
              )
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
              border: "1px solid rgb(11, 116, 229)",
              color: `rgb(11, 116, 229)`,
              width: 240,
              height: 38,
              borderRadius: 4,
            }}
            styleTextButton={{ fontWeight: 500 }}
          />
          {/* <NavBar/> */}
        </div>
      </div>
    </Loading>
  );
};

export default Home;

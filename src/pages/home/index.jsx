import React from "react";
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

const Home = () => {
  const arr = ["Television", "Laptop", "Phone"];
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct()
    return res
  } 
  const {isPending, data: products, isLoading} = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });    
  return (
    <>
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
          {products?.data.map((product) => {
            return (
              <CardComponent 
                key={product._id} 
                countInStock={product.countInStock}
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
    </>
  );
};

export default Home;

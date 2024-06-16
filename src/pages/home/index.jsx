import React from "react";
import { WrapperTypeProduct, WrapperButtonMore } from "./style";
import TypeProduct from "../../components/Product/Type";
import SliderComponent from "../../components/Slider/Slider";
import blackFriday from "../../assets/images/blackFriday.jpg";
import muathu from "../../assets/images/muathu.jpg";
import lotus from "../../assets/images/lotus.jpg";
import sofa from "../../assets/images/sofa.jpg";
import CardComponent from "../../components/Card/Card";
// import NavBar from "../../components/Navbar/Navbar";

const Home = () => {
  const arr = ["Television", "Laptop", "Phone"];
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
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignContent: "center",
            gap: 32.5,
            flexWrap: "wrap",
          }}
        >
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </div>
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

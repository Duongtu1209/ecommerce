import React from "react";
import { WrapperTypeProduct } from "./style";
import TypeProduct from "../../components/Product/Type";
import SliderComponent from "../../components/Slider/Slider";
import slider1 from "../../assets/images/slider1.webp"
import slider2 from "../../assets/images/slider2.webp"

const Home = () => {
    const arr = ['Television', 'Laptop', 'Phone']
    return (
        <div style={{padding: '0 120px'}}>
            <WrapperTypeProduct>
                {arr.map((item) => {
                    return (
                        <TypeProduct name={item} key={item}/>
                    )
                })}
            </WrapperTypeProduct>
            <SliderComponent arrImages={[slider1, slider2]}/>
        </div>
    );
}

export default Home;
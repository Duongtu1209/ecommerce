import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000
    };
    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image) => {
                return (
                    <div>
                        <Image key={image} src={image} alt="slider" preview={false} width="50%" />
                        <Image key={image} src={image} alt="slider" preview={false} width="50%" />
                    </div>

                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent
import React from 'react';
import { Checkbox, Rate } from 'antd';
import { WrapperLabelText, WrapperTextValue, WrapperContent, WrapperTextPrice } from './style';

const NavBar = () => {
    const onChange = () => {}
    const renderContent = (type, options) => {
        switch (type) {
        case 'text':
            return options.map(option => (
            <WrapperTextValue>{option}</WrapperTextValue>
            ));
        case 'checkbox':
            return (
            <Checkbox.Group style={{ width: '100%', display: 'flext', flexDirection: 'column', gap: 12 }} onChange={onChange}>
                {options.map(option => (
                <Checkbox style={{ marginLeft:0 }} value={option.value}>{option.label}</Checkbox>
                ))}
            </Checkbox.Group>
            );
        case 'star':
            return options.map((option) => {
                return (
                    <div style={{ display: 'flex' }}>
                        <Rate style={{ fontSize: 12,  }} disabled defaultValue={option}/>
                        <span>{`${option} sao`}</span>
                    </div>
                )
            })
        case 'price':
            return options.map((option) => {
                return (
                    <WrapperTextPrice>{option}</WrapperTextPrice>  
                )
            })    
        default:
            return null;
        }
    };

  return (
    <div>
      <WrapperLabelText>Label</WrapperLabelText>
      <WrapperContent>
            {renderContent('text', ['Túi lành', 'TV', 'Máy giặt'])}
      </WrapperContent>
      <WrapperContent>
            {renderContent('checkbox', [
                {value: 'a', label: 'A'},
                {value: 'b', label: 'B'},
                {value: 'c', label: 'C'}
            ])}
      </WrapperContent>
      <WrapperContent>
            {renderContent('star', [3,4,5])}
      </WrapperContent>
      <WrapperContent>
            {renderContent('price', ['duoi 400.000', 'tren 500.000'])}
      </WrapperContent>
    </div>
  );
};

export default NavBar;
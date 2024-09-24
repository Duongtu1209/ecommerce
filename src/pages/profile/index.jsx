import React, { useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel } from './style';
import InputFormComponent from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/Button/Button';

const ProfileUser = () => {
    const [email, setEmail] = useState('')
    const handleOnChangeEmail = () => {

    }
    const handleUpdate = () => {

    }
    return (
        <div style={{ width: '1600px', margin: '0 auto'}}>
            <WrapperHeader>Profile </WrapperHeader>
            <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                    <InputFormComponent id='email' style={{ width: '300px' }} value={email} handleOnChange={handleOnChangeEmail}></InputFormComponent>
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: "30px",
                            width: "fit-content",
                            borderRadius: "4px",
                            padding: '2px 6px 6px'
                        }}
                        styleTextButton={{
                            color: "rgb(26, 148, 255)",
                            fontSize: "15x",
                            fontWeight: 700,
                        }}
                        textbutton={"Cập nhật"}
                        />
                </WrapperInput>
            </WrapperContentProfile>
        </div>
    );

};

export default ProfileUser;

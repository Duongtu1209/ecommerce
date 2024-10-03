import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style';
import InputFormComponent from '../../components/InputForm/InputForm';
import ButtonComponent from '../../components/Button/Button';
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService"
import { updateUser } from '../../redux/sliders/userSlider';
import * as message from "../../components/Message/Message"
import { useCallback } from 'react';
import { Button } from 'antd';
import { UploadOutlined } from "@ant-design/icons"
import { getBase64 } from '../../services/utils';

const ProfileUser = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState('')
    const [address, setAddress] = useState('')
    
    const mutation = useMutationHook(
        data => {
            const {id, access_token, ...rests} = data            
            return UserService.updateUser(id, access_token, rests)
        }
    )

    const { isSuccess, isError } = mutation
    
    useEffect(() => {
        setName(user?.name || '')
        setEmail(user?.email || '')
        setPhone(user?.phone || '')
        setAddress(user?.address || '')
        setAvatar(user?.avatar || '')
    }, [user])

    const handleGetDetailsUser = useCallback(async (id, token) => {    
        const res = await UserService.getDetailsUser(id, token);        
        dispatch(updateUser({ ...res?.data, access_token: token }));
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess) {
            message.success()
            if (user?._id && user?.access_token) {
                handleGetDetailsUser(user._id, user.access_token)
            }
        } else if (isError) {
            message.error() 
        }
    }, [isSuccess, isError, handleGetDetailsUser, user?._id, user?.access_token])

    const handleUploadImage = async (info) => {        
        const file = info.fileList[0]?.originFileObj;
        
        if (file) {
            const base64 = await getBase64(file);
            setAvatar(base64);
        } else {
            console.error("No file uploaded or undefined");
        }
    }
    const handleUpdate = () => {        
        mutation.mutate({id: user?._id, email, name, phone, address, avatar, access_token: user?.access_token}, )
    }
    return (
        <div style={{ width: '1600px', margin: '0 auto'}}>
            <WrapperHeader>Profile </WrapperHeader>
            <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLabel htmlFor='name'>Họ và tên</WrapperLabel>
                    <InputFormComponent id='name' style={{ width: '300px' }} value={name} handleOnChange={setName}></InputFormComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                    <InputFormComponent id='email' style={{ width: '300px' }} value={email} handleOnChange={setEmail}></InputFormComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='phone'>Số điện thoại</WrapperLabel>
                    <InputFormComponent id='phone' style={{ width: '300px' }} value={phone} handleOnChange={setPhone}></InputFormComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='address'>Địa chỉ</WrapperLabel>
                    <InputFormComponent id='address' style={{ width: '300px' }} value={address} handleOnChange={setAddress}></InputFormComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor='avatar'>Ảnh đại diện</WrapperLabel>
                    <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                        <Button icon={<UploadOutlined/>}>Select image</Button>
                    </WrapperUploadFile>
                    { avatar && (
                        <img src={avatar} style={{
                            height: '60px',
                            width:'60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }} alt='avatar'/>
                    )}
                </WrapperInput>
                <ButtonComponent
                    onClick={handleUpdate}
                    size={40}
                    styleButton={{
                        height: "30px",
                        width: "fit-content",
                        borderRadius: "4px",
                        padding: '2px 6px 6px',
                        position: 'relative',
                        left: '50%',
                        transform: 'translate(-50%, 0)'
                    }}
                    styleTextButton={{
                        color: "rgb(26, 148, 255)",
                        fontSize: "15x",
                        fontWeight: 700,
                    }}
                    textbutton={"Cập nhật"}
                    />
            </WrapperContentProfile>
        </div>
    );

};

export default ProfileUser;

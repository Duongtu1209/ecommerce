import React from "react";
import NavBar from "../../components/Navbar/Navbar";
import { Row, Col } from "antd";
import CardComponent from "../../components/Card/Card";

const TypeProductPage = () => {
    return (
        <Row>
            <Col span={6}>
                <NavBar/>
            </Col>
            <Col span={18}>
                <CardComponent/>
            </Col>
        </Row>
    );
}

export default TypeProductPage;
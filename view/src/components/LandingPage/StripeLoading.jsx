import React, {Component} from "react";
import {ReactComponent as Logo} from '../../assets/logo.svg'
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { LoadingOutlined } from '@ant-design/icons';
import classes from '../../StripeLoadingStyles.module.css'; 

class StripeLoading extends Component{
    render() {

        const antIcon = <LoadingOutlined style={{ fontSize: 80, color: '#DCCCE4'}} spin />;

        return(
            <div className = {classes.containerStyle}>
                <div>
                    <Logo/>
                </div>

                <div className = {classes.padding}>
                    <Spin indicator={antIcon} />
                </div>

                <div className = {classes.textStyle}>
                    You'll Be Redirected In A Moment...
                </div>
            </div>
        )
    }
}
export default StripeLoading;

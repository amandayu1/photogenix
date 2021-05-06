import React, {Component} from "react";
import {ReactComponent as Logo} from '../assets/logo.svg'
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { LoadingOutlined } from '@ant-design/icons';

//loading page rendered during return from stripe and redirect to stripe as well as loading during sign in 
class LoadingPage extends Component{
    render() {

        const antIcon = <LoadingOutlined style={{ fontSize: 80, color: '#47817D'}} spin />;

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
export default LoadingPage;

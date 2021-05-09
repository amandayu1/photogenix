import React, {Component, /* useContext */} from "react";
import GenericButton from '../../GenericButton/Button'
import 'antd/dist/antd.css';
import './NavigationButtons.css'
import { Redirect } from 'react-router-dom';
import {Link} from "react-router-dom";

class NavigationButtons extends Component {
    
    constructor(props) {
        super(props)
        this.state={
            isFinalStep: !this.props.nextStep && this.props.prevStep,
            isFirstStep: this.props.nextStep && !this.props.prevStep,

            goToNextStep: false,
            goToPrevStep: false,
        }

        this.onNextClick = this.onNextClick.bind(this);
        this.onPrevClick = this.onPrevClick.bind(this);
    }

    onNextClick() {
        console.log('next click triggered')
        this.setState({
            goToNextStep: true
        })
        
    }
    onPrevClick() {
        this.setState({
            goToPrevStep: true
        })
        
    }

    render() {
        if(this.state.goToNextStep)
            return ( <Redirect to={this.props.nextStep} /> );
        else if(this.state.goToPrevStep)
            return ( <Redirect to={this.props.prevStep} /> );

            
        return (
        <div className="nav-container">
            <div className='back-button-container'>
                {this.state.isFirstStep ?
                null:

                <Link
                    className="btn btn-secondary back-button" 
                    onClick={this.onPrevClick}
                >
                    Go Back
                </Link>
                }
            </div>

            <div className="next-button-container">
                {this.state.isFinalStep ? 
                <GenericButton //SUBMIT BUTTON
                    overrideStyles={{
                        height:'3.75em',
                        fontWeight:"500", 
                        fontSize:'1rem', 
                        width:'150%'
                    }}
                    type="submit"
                    onClick={this.props.handleSubmit}
                    className='submit'
                />
                :
                <GenericButton //NEXT BUTTON
                    type="primary"
                    overrideStyles={{
                      fontWeight:"600",
                      fontSize:'0.85rem',
                      backgroundColor:'#755E94',
                    }}
                    onClick={this.onNextClick}
                    disabled={this.props.disabled}
                    content='Next'
                />
                }
            </div>
        </div>
        )
    }
}

export default NavigationButtons;
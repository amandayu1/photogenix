import React from "react";

import FormStepHeader from './FormComponents/FormStepHeader'
import CostInput from './FormComponents/CostInput'
import NavigationButtons from './FormComponents/NavigationButtons';
import './FormStep.css'

const PriceStep = (props) => {



    return (
        <React.Fragment>
            <FormStepHeader
                percent={25}
                caption={'Select a payment option'}
            />

            <div className="form-body">
                <CostInput
                    value={props.amount}
                    isStripeEnabled={props.isStripeEnabled}
                    handlePriceChange={props.handlePriceChange}
                    name='costInput'
                    id='costInput'
                />
            </div>
            <NavigationButtons
                nextStep={props.nextStep}
                prevStep={props.prevStep}
                disabled={props.advanceDisabled}
            />
        </React.Fragment>
    )
}

export default PriceStep
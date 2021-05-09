import { StepInForm } from "../FormStep";
import React from "react";


export default function EmailSection(props) {

    const formContainerStyle = {
        width: "inherit",
        display: 'flex',
        flexFlow: 'column nowrap',
        alignContent: 'center',
        justifyContent: 'center',
    }
    const errorStyle = {
        paddingBottom: '1rem',
        color: "#fa755a",
        fontSize: "0.75rem",
        margin: 'auto',
    }

    return (
        <div className="formContainer" style={formContainerStyle}>
            <center>
                <StepInForm
                    name="input-email"
                    renderStep={1}
                    labelName="input-email"
                    labelText="Your Email *"
                    currentStep={1}
                    handleChange={props.handleEmailFormChange}
                    value={props.recipientEmail}
                    className="form-group"
                    id="input-email"
                    type='submit'
                    placeholder="example@photogenix.studio"
                    error={props.emailError}
                    onKeyDown={props.onKeyDown}
                />
                <h3 style={errorStyle}>{props.emailError}</h3>
            </center>
        </div>
    )
}
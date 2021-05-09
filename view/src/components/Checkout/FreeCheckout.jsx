import EmailSection from "./EmailSection";
import React, { useState }/* , {Component, useEffect}  */ from "react";
/* import { OmitProps } from "antd/lib/transfer/ListBody"; */
import './StripePaymentStyles.css'
import firebase from "firebase/app";
import Button from '@material-ui/core/Button';
import { CircularProgress } from "@material-ui/core";

export default function FreeCheckout(props) {
    // const classes = useStyles();
    const [registrationError, setRegistrationErrror] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (event) => {
        setLoading(true);
        console.log(loading);

        event.preventDefault();


        var freeSignUp = firebase.functions().httpsCallable('freeSignUp');

        console.log({
            email: props.recipientEmail,
            purchaseID: props.purchaseID,
            ownerID: props.ownerID,
        })
        console.log('testinggggg')

        freeSignUp({
            email: props.recipientEmail,
            purchaseID: props.purchaseID,
            ownerID: props.ownerID,
        })
            .then((result) => {
                console.log(result.data);
                if (result.data.photogenixError) {
                    handlePurchaseFailure()
                }
                else if (result.data.success) {
                    props.handlePurchaseSuccess("This is a success from free checkout");
                }
            })

        console.log("submitted");
        setLoading(false);
        console.log(loading);
    }


    function onEnterPress(e) {
        console.log('entered on enter press');
        if (e.key === 'Enter' && e.shiftKey === false) {
            console.log('dsfgsdfgdgdsfgentered if statement in entered on enter press')
            e.preventDefault();

            if (!props.isDisabled && props.recipientEmail)
                handleFormSubmit(e);
        }

    }

    function handlePurchaseFailure() {
        setRegistrationErrror('There was an unexpected error, please reload and try again');
    }

    return (

        <div className="free-checkout-container">
            <form onSubmit={handleFormSubmit}>
                <EmailSection
                    handleEmailFormChange={props.handleEmailFormChange}
                    recipientEmail={props.recipientEmail}
                    emailError={props.emailError}
                    type='submit'
                    onKeyDown={(e) => {
                        onEnterPress(e)
                    }}
                />

                <div className="error-container">
                    <span>{registrationError}</span>
                </div>

                <Button
                    className="bookPhotoButton"
                    disabled={loading || props.recipientEmail === '' || props.recipientEmail.indexOf('@') === -1}
                    type="submit"
                    style={loading || props.recipientEmail === '' || props.recipientEmail.indexOf('@') === -1 ?
                        styles.disabledPhotoButton : styles.bookPhotoButton}
                    variant="contained"
                // onClick={() => loadingButton}
                >
                    {loading ?
                        <CircularProgress size={24} style={styles.buttonProgress} />
                        :
                        <>
                            Email it to me!
                    </>
                    }
                </Button>
            </form>

        </div>
    )
}

const styles = {
    bookPhotoButton: {
        width: "90%",
        borderRadius: 5,
        backgroundColor: "#cc2a4dea",
        color: 'white',
    },
    buttonProgress: {
        color: "#cc2a4dea",
    },
    disabledPhotoButton: {
        backgroundColor: '#e0e0e0',
        color: '#a6a6a6',
        width: "90%",
        borderRadius: 5,
        marginTop: '2%',
    },
}
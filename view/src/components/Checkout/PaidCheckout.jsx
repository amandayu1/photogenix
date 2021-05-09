import React, { useRef, useCallback } from "react";
import { useState } from "react";
import './StripePaymentStyles.css'
import CardSection from './CardSection';
import firebase from "firebase/app";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './PurchaseCheckout.css';
import { Button, CircularProgress, TextField } from "@material-ui/core";
import EmailSection from "./EmailSection";
import { Link } from "react-router-dom";

export default function PaidCheckout(props) {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [loadingPromo, setLoadingPromo] = useState(false);
  const [discount, setDiscount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState(false);
  const [promoCodeErrorText, setPromoCodeErrorText] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [finalAmount, setFinalAmount] = useState(props.amount);

  const clientSecret = useRef('');
  const [paymentError, setPaymentError] = useState('');
  const [photogenixError, setPhotogenixError] = useState('');

  const { handlePaymentSuccess } = props;
  const handleServerResponse = useCallback((response) => {
    if (response.stripeError) {
      const errorMessage = handleStripeError(response.stripeError)
      setPaymentError(errorMessage);
      console.log(response.stripeError);
      console.log(response.stripeError.message);
    }
    else if (response.photogenixError) {
      setPhotogenixError(response.photogenixError);
      console.log(response.photogenixError);
    }
    else {
      setPaymentError('');
      setPhotogenixError('');
      console.log(response);

      handlePaymentSuccess('this is a success from payed');
    }

  }, [handlePaymentSuccess])


  const cardRequiresAction = useCallback(async () => {
    console.log("the card required additional action to submit payment");

    const { error } = await stripe.confirmCardPayment(clientSecret.current);
    if (error) {
      // The payment failed -- ask your customer for a new payment method.
      console.log(error);
      handleServerResponse({
        stripeError: error
      });

    } else {
      // The payment has succeeded.
      console.log("the payment succeeded.");

      handleServerResponse({
        success: 'success'
      });
    }
  }, [handleServerResponse, stripe]);

  async function startCheckoutOnClick() {

    if (!props.isDisabled) {
      console.log("entered onclick");
      console.log("Price is: " + finalAmount);
      console.log('email in scope of startCheckout is: ', props.recipientEmail);

      clientSecret.current = await getClientSecretFromIntent(props.recipientEmail, props.purchaseID, props.ownerID, props.type, finalAmount, promoCode);

      console.log('client secret is', clientSecret.current);
    }
  }

  const handlePromoCode = async () => {
    setLoadingPromo(true);
    const verifyPromoCode = firebase.functions().httpsCallable('verifyPromoCode');
    await verifyPromoCode({
      uid: props.ownerID,
      purchaseID: props.purchaseID,
      promoCode: promoCode,
    })
      .then((result) => {
        if (!result.error && result.data) {
          setPromoCodeError(false);
          setPromoCodeErrorText("");
          setDiscount(result.data.discount);
          setFinalAmount(Math.round(props.amount * (100 - result.data.discount)) / 100);
        }
        else {
          setPromoCodeError(true);
          setPromoCodeErrorText("The code " + promoCode + " does not exist.")
        }
      });
    setLoadingPromo(false);
  }

  const showPromoCode = () => {
    setShowPromo(true);
  }

  const handlePaymentSubmit = async (event) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    setLoading(true);
    event.preventDefault();

    if (!props.isDisabled) {

      console.log("entered onclick");
      console.log("Price is: " + finalAmount);
      console.log('email in scope of startCheckout is: ', props.recipientEmail);

      clientSecret.current = await getClientSecretFromIntent(props.recipientEmail, props.purchaseID, props.ownerID, props.type, finalAmount, promoCode)

      if (typeof clientSecret.current.data !== "undefined") {
        window.location.reload();
        return;
      }

      console.log('client secret is', clientSecret.current);

      console.log("entered onclick")
      console.log("Price is: " + finalAmount);

      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      await confirmCardPayment();
      setLoading(false);

    }
  }

  async function confirmCardPayment() {
    console.log("confirming the card payment with client secret", clientSecret.current);
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret.current, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: props.recipientEmail,
        },
      }
    });

    if (confirmError) {
      handleServerResponse({
        stripeError: confirmError
      });
    }
    else {
      console.log("there was no issue confirming the card payment.");
      // Check if the PaymentIntent requires any actions and if so let Stripe.js handle the flow.
      if (paymentIntent.status === "requires_action") {
        // Let Stripe.js handle the rest of the payment flow.
        cardRequiresAction();
      }
      else {
        // The payment has succeeded.
        handleServerResponse({
          success: 'success'
        });
      }
    }
  }


  function onEnterPress(e) {
    console.log('entered on enter press');

    console.log(e.key);

    if (e.key === 'Enter' && e.shiftKey === false) {
      console.log('dsfgsdfgdgdsfgentered if statement in entered on enter press')
      e.preventDefault();

      if (!props.emailError && props.recipientEmail)
        startCheckoutOnClick();
    }

  }

  return (
    <div className="checkout-form-container">
      <EmailSection
        handleEmailFormChange={props.handleEmailFormChange}
        recipientEmail={props.recipientEmail}
        emailError={props.emailError}
        onKeyDown={(e) => {
          onEnterPress(e)
        }}
      />
      <div className="payment-form-container">
        <form onSubmit={handlePaymentSubmit}>
          <div className="card-section">
            <CardSection />
          </div>

          <div className="payment-error-container">
            <span>{paymentError || photogenixError}</span>
          </div>

          {showPromo ?
            <div>
              <div className="promo-code-input">
                <TextField
                  fullWidth
                  label="Promo Code"
                  variant="outlined"
                  size="small"
                  error={promoCodeError}
                  helperText={promoCodeErrorText}
                  onChange={(event) => { setPromoCode(event.target.value) }}
                />
              </div>

              <div className="promo-code-button">
                <Button className="promo-code-button" disabled={loadingPromo} onClick={handlePromoCode} color="primary" variant="contained">
                  {loadingPromo ?
                    <CircularProgress size={24} style={styles.buttonProgress} />
                    :
                    <>
                      Apply
                  </>
                  }
                </Button>
              </div>
            </div>
            : <div><Link className="promo-code-show" onClick={showPromoCode}>Have a promo code?</Link></div>}

          {discount !== "" ?
            <div className="promo-message" >You've been given {discount}% off!</div>
            : null}

          <Button
            className="bookPhotoButton"
            disabled={loading || !stripe || props.isDisabled || props.recipientEmail === '' || props.recipientEmail.indexOf('@') === -1}
            type="submit"
            style={loading || props.recipientEmail === '' || props.recipientEmail.indexOf('@') === -1 ? styles.disabledPhotoButton : styles.bookPhotoButton}
          >
            {loading ?
              <CircularProgress size={24} style={styles.buttonProgress} />
              :
              <>
                Buy Now &nbsp; ${finalAmount.toFixed(2)} {props.currency}
              </>
            }
          </Button>
        </form>

      </div>

    </div>
  )
}

function handleStripeError(stripeError) {
  if (stripeError.type === 'card_error') {
    console.log(stripeError);
    return stripeError.message;
  }

  else {
    return 'We could not process your request. Please try again later.'
  }
}

async function getClientSecretFromIntent(email, purchaseID, ownerID, type, finalAmount, promoCode) {
  console.log('retrieving the client secret...');

  console.log("creating the payment intent now...");
  var createPaymentIntent = firebase.functions().httpsCallable('createPaymentIntent')

  console.log('email used is: ', email)

  const purchaseDetails = {
    purchaseDetails: {
      email: email, //if its a mobile payment, the email will be included in the billing details
      purchaseID: purchaseID,
      ownerID: ownerID,
      type: type,
    }
  }
  if (promoCode !== "") {
    purchaseDetails.purchaseDetails.promoCode = promoCode;
    purchaseDetails.purchaseDetails.selectedPrice = finalAmount;
  }

  const secret = await createPaymentIntent(purchaseDetails);

  const returnedClientSecret = secret.data.clientSecret;
  console.log("client secret is: ", returnedClientSecret);
  return returnedClientSecret;

}

const styles = {
  bookPhotoButton: {
    width: "90%",
    borderRadius: 5,
    backgroundColor: "#5060bb",
    color: 'white',
    marginTop: '10px',
  },

  buttonProgress: {
    color: "#5060bb",
  },
  disabledPhotoButton: {
    backgroundColor: '#e0e0e0',
    color: '#a6a6a6',
    width: "90%",
    borderRadius: 5,
    marginTop: '10px',
  },
}

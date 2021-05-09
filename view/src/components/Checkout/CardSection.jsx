import {CardElement} from '@stripe/react-stripe-js';
import React from "react";
import './StripePaymentStyles.css'


export default function CardSection (props) {
    const CARD_ELEMENT_OPTIONS = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: '"Assistant", Assistant, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "1rem",
            boxShadow: "2px 4px 10px 0px rgba(0,0,0,0.25)",
            borderRadius: "10px 10px 10px 10px",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      };

    return (
      <div className="card-details-container">
        <label className="card-details-label">
            Card details
        </label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        
      </div>
    )
}
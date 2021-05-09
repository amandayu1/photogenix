import React, { Component } from "react";
import { auth, generateReceiptDocument, getPurchaseDocument, getUserByUsername } from "../../firebase";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PaidCheckout from "./PaidCheckout";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import FreeCheckout from "./FreeCheckout";
import './PurchaseCheckout.css';
import config from '../../config';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Button } from '@material-ui/core';

let eventObject;

class PurchaseCheckout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            //this block is for variable seller/purchase information
            title: '',
            caption: '',
            purchaseID: '',
            ownerID: '',
            isPublic: '',
            ownerName: '',
            amount: 0,
            currency: 'usd',
            //recipient state pieces
            recipientEmail: '',
            receiptEmailConfirmed: false,
            //error booleans
            pageErrorBool: false,
            pageErrorMessage: '',
            emailErrorBool: false,
            emailError: '',
            expiredError: '',
            paymentError: '',
            stripeAccountID: '',
            stripePromise: null,
            purchase: { price: {} },
            descLength: 0,
            descSeeMore: false,
        }
        this.setPageErrorMessage = this.setPageErrorMessage.bind(this);
        this.handleEmailFormChange = this.handleEmailFormChange.bind(this); //handles email form
        this.handlePurchaseSubmit = this.handlePurchaseSubmit.bind(this); //handles submission
        this.handleBackSubmit = this.handleBackSubmit.bind(this); //handles back button
    }

    componentDidMount = async () => {


        try {
            //destructuring URL info
            const { params: { username, purchaseID } } = this.props.match;

            //gets relevant documents
            const user = await getUserByUsername(username);
            const purchase = await getPurchaseDocument(user.userID, purchaseID);

            //verifies the purchase should be public
            let isPublic = true;
            if (auth.currentUser) {
                isPublic = auth.currentUser.uid === user.userID ? false : true;
            }

            //sets state for checkout page
            await this.setState({
                purchase: purchase,
                descLength: purchase.caption.length,
                title: purchase.title,
                caption: purchase.caption,
                purchaseID: purchaseID,
                ownerID: purchase.ownerID,
                ownerName: purchase.ownerName,
                amount: purchase.price.amount,
                type: purchase.price.type,
                currency: purchase.price.currency,
                isPublic: isPublic,
                stripeAccountID: user.stripeAccountID,
                stripePromise: loadStripe(config.stripeKey,
                    {
                        stripeAccount: user.stripeAccountID
                    }),

            })
            console.log(this.state.stripeAccountID);

            eventObject = {
                title: purchase.title + " by " + purchase.ownerName,
                caption: "",
            }
            if (purchase.caption !== "") {
                eventObject.caption = "Caption:\n" + purchase.caption;
            }
        }
        catch (err) {
            this.setState({
                pageErrorBool: true,
                pageErrorMessage: 'No user was found.'
            })
            console.error(err)
        }

        //anonymously authenticates for firebase rules
        if (!auth.currentUser) {
            await auth.signInAnonymously()
                .catch(function (error) {
                    console.error(error);
                });
            console.log("anon signed")
        }

        console.log("anonymously authenticated: " + auth.currentUser.uid);
        console.log(this.state.purchaseID);
        console.log(this.state.amount);
    }
    handleMoreDesc = () => {
        this.setState({
            descSeeMore: !this.state.descSeeMore
        })
    };
    //handles email form, checks against email regex
    handleEmailFormChange(event) {

        //used to identify change val, target state and component changes came from
        const { value } = event.target

        console.log('entered handle email form change');

        if (value.length >= 320) {
            this.setState({
                emailErrorBool: true,
                emailError: 'The email you have entered is too long.',
                recipientEmail: value.replace(/(\n\n?)\n+/g, '$1').slice(0, 319),
            });
        }
        else if (value.indexOf('@') === -1)
            this.setState({
                emailErrorBool: true,
                emailError: 'The email you have entered is invalid.',
                recipientEmail: value.replace(/(\n\n?)\n+/g, '$1')
            });

        else {
            this.setState({
                emailErrorBool: false,
                emailError: '',
                recipientEmail: value.replace(/(\n\n?)\n+/g, '$1')
            });
        }
    }

    //pushes user back to seller page
    handleBackSubmit() {
        const { params: { username } } = this.props.match;
        this.props.history.push("/@" + username);
    }

    setPageErrorMessage = async (message) => {
        await this.setState({
            pageErrorMessage: message,
            pageErrorBool: true,
        });
    }

    handlePurchaseSuccess = async (successMessage) => {
        if (successMessage) {
            console.log(successMessage);
            await this.setState({
                receiptEmailConfirmed: true
            })
        }
    }

    handlePurchaseSubmit = async () => {

        //checks against conditions that should prevent a submit
        if (!this.state.isPublic || this.state.emailErrorBool || this.state.expiredError || this.state.pageErrorBool)
            return null;
        //generates a receipt with all the purchases state pieces and an email
        const receiptRef = await generateReceiptDocument(
            this.state.ownerID,
            this.state.title,
            this.state.caption,
            this.state.purchaseID,
            this.state.recipientEmail,
        );
        console.log("The receipt reference is: " + receiptRef);
        //changes state in order to render confirmation page
        await this.setState({
            receiptEmailConfirmed: true
        })
    }

    // the confirmation page
    confirmationPage = (title, recipientEmail) => {
        return (
            <React.Fragment>

                <div style={{ margin: 'auto', verticalAlign: 'middle', display: 'flex', justifyContent: 'center', marginTop: "4rem" }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', maxWidth: '80%' }}>
                        <div>
                            <CheckCircleIcon style={{ fill: '#D08B7F', fontSize: 'xxx-large' }}></CheckCircleIcon>
                        </div>
                        <div style={successfulTextStyle}>
                            {(this.state.amount) ? (<div>Payment Successful!</div>) : (<div>Successful!</div>)}
                        </div>
                        <div style={{ marginBottom: '1rem', wordWrap: 'break-word' }}>
                            <h2 style={{ fontWeight: '300', color: '#4B4B4B' }}> You have received
                            <span style={{ color: '#D08B7F' }}> {title} </span> by <span style={{ color: '#D08B7F' }}>{this.state.ownerName}</span>
                            .  Thank you for using our platform!</h2>
                        </div>

                        {(this.state.amount) ? (<div className="smallMessage" style={subButtonTextStyle}>
                            Receipt emailed separately by Stripe.</div>)
                            : null}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    render() {
        //render this if there was an issue getting the user
        if (this.state.pageErrorBool) {
            return <h1>{this.state.pageErrorBool}</h1>
        }

        //render this if the email form has been submitted
        else if (this.state.receiptEmailConfirmed) {
            return this.confirmationPage(this.state.title, this.state.recipientEmail);
        }

        //console.log(this.state.ownerName);
        //else render this​

        return (
            <React.Fragment>

                <div className="bodyContainer" style={bodyContainerStyle}>
                    <div className="textContainer" style={textContainerStyle}>
                        <div className="header">
                            <Button className="back-to-browse" color="primary" onClick={this.handleBackSubmit}>
                                <ArrowBackIosIcon />
                                <span>Back</span>
                            </Button>
                        </div>

                        <div className="side-padding photo-info">
                            <span className="photo-title"> {this.state.title} </span>
                            <span style={byOwnerStyle}>by  <span style={ownerNameTextStyle}>{this.state.ownerName}</span></span>

                            {this.state.caption === null &&
                                <div className="section-header">
                                    Caption
                             </div>
                            }

                            <div className="section-text">
                                {this.state.caption}
                            </div>

                        </div>
                    </div>

                    <div className="error-container">
                        <span>{this.state.expiredError || this.state.pageErrorMessage}</span>
                    </div>

                    <div className="formContainer" style={formContainerStyle}>
                        {this.state.type === "paid" &&
                            <Elements stripe={this.state.stripePromise}>
                                <center>
                                    <PaidCheckout
                                        amount={this.state.amount / 100}
                                        currency={this.state.currency}
                                        ownerID={this.state.ownerID}
                                        isDisabled={this.state.recipientEmail === '' || this.state.emailError || this.state.paymentError || !this.state.isPublic}
                                        stripeAccountID={this.state.stripeAccountID}

                                        handleEmailFormChange={this.handleEmailFormChange}
                                        unexpectedErrorHandler={this.setPageErrorMessage}

                                        recipientEmail={this.state.recipientEmail}
                                        emailError={this.state.emailError}

                                        type={this.state.type}
                                        handlePaymentSuccess={this.handlePurchaseSuccess}
                                        purchaseID={this.state.purchaseID}
                                    />
                                </center>
                            </Elements>
                        }
                        {this.state.type === "free" &&
                            <div className="free-checkout-container">
                                <FreeCheckout
                                    /* email form props */
                                    handleEmailFormChange={this.handleEmailFormChange}
                                    emailError={this.state.emailError}
                                    unexpectedErrorHandler={this.setPageErrorMessage}

                                    /*props for calling checkout function*/
                                    recipientEmail={this.state.recipientEmail}
                                    ownerID={this.state.ownerID}
                                    purchaseID={this.state.purchaseID}

                                    type={this.state.type}
                                    /*submit button props*/
                                    handlePurchaseSuccess={this.handlePurchaseSuccess}
                                    isDisabled={this.state.recipientEmail === '' || this.state.emailError || this.state.paymentError || !this.state.isPublic}
                                />

                            </div>
                        }
                        <div className="smallMessage" style={subButtonTextStyle}>Access to the photo will be emailed.</div>
                        <div className="smallMessage" style={subButtonText2Style}>Receipt emailed separately by Stripe.</div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const bodyContainerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
}
const ownerNameTextStyle = {
    color: "#5060bb",
}
const formContainerStyle = {
    width: "inherit",
}
const textContainerStyle = {
    display: "flex",
    width: "inherit",
    height: "inherit",
    justifyContent: "center",
    alignContent: "flex-start",
    flexDirection: "column",
    textAlign: "left",
}
const byOwnerStyle = {
    fontSize: "1.2rem",
    fontWeight: '400',
    marginLeft: "0.7rem"
}

const subButtonTextStyle = {
    paddingTop: "0.75rem",
    fontSize: "0.75rem",
    color: "#767676",
    fontWeight: "500",
}

const subButtonText2Style = {
    paddingTop: "0rem",
    fontSize: "0.75rem",
    color: "#767676",
    fontWeight: "500",
}

const successfulTextStyle = {
    fontSize: "1.8rem",
    color: "#5060bb",
    fontWeight: "600",
    marginBottom: '3rem'
}

export default PurchaseCheckout;




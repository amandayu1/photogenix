import React, { Component } from "react";
import PublicProfileContainer from "./PublicProfilePage";
import PurchaseCheckout from "./Checkout/PurchaseCheckout";
import { Route, withRouter, Switch } from "react-router-dom";

class UserView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profileContainer: '', //component
      userErrorMessage: '', //message which gets displayed if there is an error
      purchaseDocumentsContainer: '', //component
      purchaseRequestObj: '', //passed to purchase checkout to reduce time spent loading
      redirectToCheckoutURL: '', //generated from purchase id and purchase owner

    }
    this.handlePurchaseRequest = this.handlePurchaseRequest.bind(this);
  }

  //logic for sending users to the checkout page after clicking
  handlePurchaseRequest = async (purchase) => {

    //sets state pieces then pushes user to generated url
    try {
      await this.setState({
        purchaseRequestObj: purchase,
        redirectToCheckoutURL: '/@' + purchase.ownerUserName + '/' + purchase.purchaseID
      })

      console.log(this.state.purchaseRequestObj.stripeAccountID);

      this.props.history.push(this.state.redirectToCheckoutURL);
    }
    catch (err) {
      this.setState({
        userErrorMessage: "there was an issue with your purchase. try again later"
      })
    }
  }

  //holds routes for the user flow
  render() {

    return (
      <Switch>

        <Route
          path='/@:username/:purchaseID'
          render={(props) => (
            <PurchaseCheckout
              {...props}
            />
          )}
        />

        <Route
          exact path='/@:username'
          render={(props) => (
            <PublicProfileContainer
              {...props}
              handlePurchaseRequest={this.handlePurchaseRequest}
            />
          )}
        />

      </Switch>)
  }
}

export default withRouter(UserView);
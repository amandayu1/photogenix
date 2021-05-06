import React, {Component} from "react";
import PublicProfileContainer from "./PublicProfilePage";
import BookingCheckout from "./Checkout/BookingCheckout";
import { Route, withRouter, Switch } from "react-router-dom";

  class UserView extends Component {
      constructor(props) {
          super(props)
          this.state ={
              profileContainer: '', //component
              userErrorMessage: '', //message which gets displayed if there is an error
              bookingDocumentsContainer: '', //component
              bookingRequestObj: '', //passed to booking checkout to reduce time spent loading
              redirectToCheckoutURL: '', //generated from booking id and booking owner

          }
          this.handleBookingRequest = this.handleBookingRequest.bind(this);
      }

      //logic for sending users to the checkout page after clicking
      handleBookingRequest = async (booking) => {

        //sets state pieces then pushes user to generated url

        try{
          
          await this.setState({
            bookingRequestObj: booking,
            redirectToCheckoutURL: '/@'+booking.ownerUserName+'/'+booking.bookingID
          })

          console.log(this.state.bookingRequestObj.stripeAccountID);
          
          this.props.history.push(this.state.redirectToCheckoutURL);
        }
        catch(err) {
          this.setState({
            userErrorMessage: "there was an issue with your booking. try again later"
          })
        }

      }

      //holds routes for the user flow
      render () {
        
        return (
        <Switch>
        
          <Route 
            path='/@:username/:bookingID'
            render={(props) => (
              <BookingCheckout
                {...props}
              />
            )}
          />

          <Route
            exact path='/@:username'
            render={(props) => (
              <PublicProfileContainer 
                {...props}
                handleBookingRequest={this.handleBookingRequest}
              />
            )}
          />

          
        </Switch>) 
      }
  }

  export default withRouter (UserView) ;
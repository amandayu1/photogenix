//top level file of the offering creation flow
//will house change handlers, variables relevant to the creation of an offering, components for each step in the form
//this component will act as something like a router for each step in the form

import React, { Component } from "react";
import { Progress } from 'antd';
import { generateBookingDocument, auth } from "../../firebase"



//TODO DEC 15
/*
fix the next buttons so they work
change the styling to match the current form
    formating of components so they are vertical
    formatting of text input 
*/

class OfferingCreationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      caption: '',
      formSubmitted: false,
      amount: 0,
      currency: 'USD',
      isStripeEnabled: this.props.isStripeEnabled,
    }
    this.handleTextChange = this.handleTextChange.bind(this);

  }

  handleTextChange(event) {

    const { value, id, name } = event.target;


    switch (id) {
      case 'title':
        value.length < 101 ?
          this.setState({
            title: value,
          })
          :
          console.log("Your title is too long");
        //value ? this.setState({requiredFieldFilled: true}) : this.setState({requiredFieldFilled: false});
        break;
      case 'caption':
        value.length < 200 ?
          this.setState({
            caption: value,
          })
          :
          console.log("Your caption is too long");
        //value ? this.setState({requiredFieldFilled: true}) : this.setState({requiredFieldFilled: false});
        break;
      case 'amount':
        value.length < 6 ?
          this.setState({
            amount: value,
          })
          :
          console.log("Your amount is too long");
        //value ? this.setState({requiredFieldFilled: true}) : this.setState({requiredFieldFilled: false});
        break;
      default:
        this.setState({
          [name]: value
        });
    }
  }

  handleSubmit = async (event) => {
    //required, do not change this
    event.preventDefault()

    //makes state variables a little easier to access for booking generation
    var { title, caption, amount, currency } = this.state
    const user = auth.currentUser;

    //generates a booking doc with all state variables and user photo as validation
    try {
      const bookingDoc = await generateBookingDocument(
        user,
        title, caption,
        {//this is the price object
          amount: amount,
          currency: currency
        }
      );

      console.log(bookingDoc);
    } catch (err) {
      console.error(err);
      alert("There was an issue with submission, please try again");
    }

    //tells react to leave here and render profile page
    this.setState({ formSubmitted: true });
  }

  render() {
    return (
      <React.Fragment>
        <Progress
          strokeLinecap="square"
          strokeColor="#755E94"
          percent={this.state.progressBarPercent}
          showInfo={false}
        />

      </React.Fragment>
    )
  }
}

export default OfferingCreationForm;
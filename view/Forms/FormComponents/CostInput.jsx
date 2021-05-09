import React, { Component } from "react";
import ConnectWithStripeButton from "../../StripeButton/ConnectWithStripeButton"
import 'antd/dist/antd.css';
import { Radio } from 'antd';
import { ReactComponent as QuestionIcon } from '../../../assets/questionicon.svg'
import './CostInput.css'
import TextInput from './TextInput'


class CostInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
      paymentOption: 'free',
      price: 0,
      isStripeEnabled: this.props.isStripeEnabled //replace with logic to check if the user has connected their stripe or not
    }
    this.onRadioChange = this.onRadioChange.bind(this);
  }

  //onchange handler for radio selection
  onRadioChange(e) {
    if (this.state.isStripeEnabled) {
      this.setState({ paymentOption: e.target.value })
    }

  }

  parseProfitRecieved(amount) {
    var stripeFees = amount * 0.029 + 0.3;
    const profitRecieved = (amount - stripeFees).toFixed(2);
    return profitRecieved;
  }

  render() {


    return (
      <React.Fragment>
        <Radio.Group onChange={this.onRadioChange} defaultValue="Free" buttonStyle='solid' style={{ borderRadius: '2rem' }}>
          <Radio.Button value="free" autoFocus={true} >Free</Radio.Button>
          <Radio.Button disabled={!this.state.isStripeEnabled} value="fixed">Fixed</Radio.Button>

        </Radio.Group>

        <div className={'paymentContentContainer'}>
          {this.state.paymentOption === 'fixed' ?
            <div className={'textWhenFixed'}>
              <TextInput
                name="amount"
                labelName="amount"
                labelText="Price Per Person (USD)"
                handleChange={this.props.handlePriceChange}
                value={this.props.value}
                // could be wrong
                photoName="form-group"
                id="amount"
                type="number"
                autoSize={{ "minRows": "1", "maxRows": "3" }}
                placeholder="0"
              />

              <div className={'feesTextContainer'}>
                {
                  this.props.value === 0 ?
                    null
                    :

                    <p>Cost to buyer: ${this.props.value} <br />
                    Fees Photogenix takes $0, Stripe charges 30¢ + 2.9%, for international currency transactions, fees may vary

                      <span style={{ fontWeight: '600', fontSize: '1.25rem' }}>
                        Approximate Profit: {'$' + this.parseProfitRecieved(this.props.value) + ' USD'}
                      </span>

                    </p>
                }

              </div>
            </div>
            :
            <div >
              <div className={'textWhenFree'}>
                Purchasers will not have to pay to recieve the photo
                </div>

              {this.state.isStripeEnabled === false ?
                <div className={'textWhenFixed'}>

                  <p>Stripe setup is required to accept payment on Photogenix</p>
                  <ConnectWithStripeButton
                  /* onClickHandler={handleStripeClick} */
                  />
                </div>
                :
                null}

            </div>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default CostInput
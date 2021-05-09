import React, { Component } from "react";
import { getUserByUsername } from "../firebase";
import { PurchasesContainer } from "./CardContainer";
import { withStyles } from '@material-ui/core/styles';
import 'antd/dist/antd.css';
import { ReactComponent as Logo } from "../assets/logo.svg";

const useStyles = theme => ({

  imgStyle: {
    width: "inherit",
    display: "inline-flex",
    flexDirection: "column",
    flexFlow: "column wrap",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: "2em",
    fontFamily: "Assistant",
    borderRadius: "88px",
  },
  itemsStyle: {
    width: "100%",
    display: "inline-flex",
    flexDirection: "column",
    flexFlow: "column wrap",
    fontFamily: "Assistant",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  containerStyle: {
    height: "100vh",
    width: "inherit",
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: "5rem",
    maxHeight: "600px",
    marginBottom: "5rem",
  },
  headingStyle: {
    color: "#5060bb",
    fontFamily: "Assistant",
    fontSize: "24px",
    fontWeight: "600",
    marginTop: "8%",
    marginBottom: "8%",
  },
  captionStyle: {
    color: "#4B4B4B",
    fontFamily: "Assistant",
    fontSize: "14px",
    fontWeight: "300",
    marginBottom: "0px",
    width: "70%",
  },
 
});

class PublicProfileContainer extends Component {
  constructor(props) {
    super(props)

    //state pieces to display seller info
    this.state = {
      username: this.props.username,
      photoURL: this.props.photoURL,
      sellerName: this.props.sellerName,
      outLink: this.props.outLink,
      uid: this.props.uid,
      stripeAccountID: this.props.stripeAccountID,
      errorBool: false,
      loading: true
    }
  }


  componentDidMount = async () => {
    //destructures username from url
    const { params: { username } } = this.props.match;
    console.log('this.props.match is: ', this.props.match);

    //sets state for this view with user information
    try {
      const user = await getUserByUsername(username.toLowerCase().trim());
      console.log('user is', user)

      const purchaseDocumentsContainer = <PurchasesContainer uid={user.userID}
        purchaseRequestHandler={this.props.handlePurchaseRequest}
        ownerName={user.displayName}
        ownerUserName={username}
        stripeAccountID={user.stripeAccountID}
      />
      console.log('setting state to render...');

      this.setState({
        username: user.username,
        photoURL: user.photoURL,
        sellerName: user.displayName,
        outLink: user.outLink,
        uid: user.uid,
        purchaseDocumentsContainer: purchaseDocumentsContainer,
        loading: false,
        stripeAccountID: user.stripeAccountID,
      })
      console.log('The state has been sent');
    }
    catch (err) {
      console.log('There was an error in componentDidMount');
      console.error(err);
      await this.setState({
        errorBool: true,
        loading: false
      })
    }

  }

  //renders seller information and purchaseDocuments
  render() {

    const { classes } = this.props;

    if (this.state.loading) {
      console.log('The page is loading');
      return null;
    }

    if (this.state.errorBool) {

      console.log('There was no seller found here');

      return (

        <div className={classes.containerStyle}>
          <div> <Logo /> </div>
          <h1 className={classes.headingStyle}>Seller Not Found</h1>
          <p className={classes.captionStyle}>It looks like there’s no seller registered with this name. Double check the URL or contact the seller you were trying to find.</p>
          <div style={{ marginBottom: "20%" }}></div>
          <h4 className={classes.captionStyle}>
            Think this is a mistake?
              </h4>
          <h4 style={{ color: "#5060bb", fontWeight: "700" }}>
            <a style={{ color: '#5060bb' }} href="mailto:hello@photogenixstudio.com">
              Email us
                </a>
          </h4>
        </div>
      )

    }

    console.log('Rendering default stuff...');
    return (
      <>
        <div className={classes.profilePageStyle}>
          <div className={classes.profileStyle}>
            <div className={classes.imgStyle}>
              <div
                style={{
                  background: `url(${this.state.photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'}) no-repeat center/contain`,
                  backgroundSize: "cover",
                  height: "150px",
                  width: "150px",
                  borderRadius: "100000px",
                  marginLeft: 'auto',
                  marginRight: '0px'
                }}
              ></div>
            </div>

            <div className={classes.itemsStyle}>

              <div>
                <h1 style={{ fontSize: "1.5rem", marginBottom: '0px', fontWeight: "600", color: '#4B4B4B' }}>  {this.state.userErrorMessage ? this.state.userErrorMessage : this.state.sellerName}</h1>
              </div>
              <div>
                <h2 style={{ fontSize: "0.875rem", color: '#5060bb', fontWeight: '400' }}> @{this.state.userErrorMessage ? this.state.userErrorMessage : this.state.username}</h2>
              </div>

            </div>
          </div>

          <div>
            {this.state.purchaseDocumentsContainer}
          </div>
        </div>
      </>
    );
  }

}

export default withStyles(useStyles)(PublicProfileContainer);
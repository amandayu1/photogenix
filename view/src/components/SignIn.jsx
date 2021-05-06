import React, { Component } from "react";
import { auth, signInWithGoogle, generateUserDocument } from "../firebase";

// import "antd/dist/antd.css";
import { GoogleCircleFilled } from "@ant-design/icons";

import LoadingPage from "./LoadingPage";
import GenericButton from "./GenericButton/Button";

const firebaseAuthKey = "firebaseAuthInProgress";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, error: null, 
    }
  }
  componentDidMount = () => {
    //this will only work for google auth
    console.log('component is mounting');
    if (!auth.currentUser) {this.setState({
      // has user
      isLoading: false,
    })}
    auth.getRedirectResult().then(function (result) {
      if (result.credential) {
        generateUserDocument(result.user);
        console.log("user document generated succesfully");
      }
    });

    console.log('component has mounted');

  };
  
  handleSignIn = () => {
    signInWithGoogle();
    // localStorage.setItem(firebaseAuthKey, "1");
  }
  redirectToLoading = () => {
    window.location = '/SignInLoading';
  };
  render() {
    console.log('Component is rendering');
    console.log(this.state);

    return ( (localStorage.getItem(firebaseAuthKey) === "1") ? (<LoadingPage />) : (
      <div className="login-body">
        <div className="login">
          <div className="login-items">
            {" "}
 
          </div>
          <div>
            <h2
              style={{
                color: "#707070",
                width: "300px",
                fontWeight: "lighter",
              }}
              className="login login-items"
            >
              Grow Your Online<br></br> Photography Business.
            </h2>
          </div>
          {this.state.error !== null && (
            <div className="py-4 bg-red-600 w-full text-white text-center mb-3">
              {this.state.error}
            </div>
          )}


          <div>
            <GenericButton
              onClick={() => {
                this.redirectToLoading();
              }}
              content={
                <div>
                  <GoogleCircleFilled
                    style={{ fontSize: "1.5rem", paddingRight:'0.7rem' }}
                  />
                  Continue with Google
                </div>
              }
            />

          </div>
        </div>
      </div>)
    );
  }
}

export default SignIn;
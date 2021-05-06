import React, { Component } from "react";
import { auth, signInWithGoogle, generateUserDocument } from "../firebase";

import LoadingPage from "./LoadingPage";
class SignInLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInSuccess:false,
    }
  }
  componentDidMount = () => {
    auth.getRedirectResult().then(function (result) {
      if (result.credential) {
        generateUserDocument(result.user);
        console.log("user document generated successfully");
      }
    });
    this.signIn();

  };
  
  signIn = async () => {
    console.log("sign in function")
    if ((!auth.currentUser || !auth.currentUser.displayName) &&  this.props.initialized){
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Error signing in with Google", error);
      }
    }
    else {
      // should do nothing and redirect to profile page
    }
  };
  render() {
    return (
      <React.Fragment>
        <LoadingPage/>
        
      </React.Fragment>
    );
  }
}

export default SignInLoading;

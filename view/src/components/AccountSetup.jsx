import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { auth, getUserByUsername, generateUserDocument } from "../firebase";
import { Redirect } from "react-router-dom";
import 'antd/dist/antd.css';
import { StepInForm } from "./FormStep";
import { ReactComponent as LogoIcon } from "../assets/LogoIcon.svg";
import Button from '@material-ui/core/Button';
import firebase from "firebase/app";
import { CircularProgress } from "@material-ui/core";

const AccountSetup = () => {

  //variables used to pass content into firestore for the seller
  const [username, setUsername] = useState("");
  const [validStatus/* , setValidStatus */] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //provider context
  const { updateContext } = useContext(UserContext);

  if (validStatus) {
    return <Redirect to='/ProfilePage' />
  }

  const validateUsername = async (username) => {
    //prevents any submitions that violate username requirements
    const usersMatchingUsername = await getUserByUsername(username);
    if (usersMatchingUsername) {
      setError("This username has been taken, try a different one.");
      return false;
    }
    return true;
  }

  //adds user info to firestore on click
  const addUserInfoHandler = async (event, username) => {
    event.preventDefault();
    setLoading(true);

    //prevents any submitions that violate username requirements
    const usernameIsFree = await validateUsername(username);

    if (usernameIsFree) {
      try {
        await generateUserDocument(auth.currentUser);
        await firebase.functions().httpsCallable('submitEditProfile')({
          username: username,
        });

        updateContext(auth.currentUser);
        setLoading(false);
      }
      catch (error) {
        console.error(error);
      }
    }
  }

  //helper function for changing fields
  const onChangeHandler = async event => {
    //name is the name of the field, value is what is currently in the field
    const { name, value } = event.currentTarget;
    //uses methods generated above to set values of relevant variables
    if (name === "username" && value.length < 25) {
      //removes spaces and capital cases to better reflect the username shown in a URL
      setUsername(value.replace(/\s/g, '').toLowerCase());
      setError(null);

    }
  };

  return (
    <div>
      <h1 className="account-setup" style={{ paddingTop: "1.9725rem", fontWeight: "600", color: "#4b4b4b" }}>Nice to meet you, <span style={{ color: "#47817D" }}>{(auth.currentUser.displayName.split(' '))[0] || 'Friend'}!</span></h1>
      <div
        style={{
          background: `url(${auth.currentUser.photoURL || <LogoIcon />})  no-repeat center center`,
          backgroundSize: "cover",
          height: "100px",
          width: "100px",
          borderRadius: "80px",
          margin: 'auto',
          marginTop: '1.668rem',
        }}
        className="border border-blue-300"
      ></div>
      <h2 style={{ margin: "auto", marginTop: '1.429rem', marginBottom: '0.525rem', fontWeight: "300", color: '#4B4B4B' }}>Set Up Your Profile</h2>

      {error !== null && <div style={{ color: '#fa755a' }}>{error}</div>}
      <form className="accountInfoForm">

        <StepInForm
          name="username"
          renderStep={1}
          labelName="username"
          labelText="Username"
          required={true}
          currentStep={1}
          handleChange={(event) => onChangeHandler(event)}
          value={username}
          className="form-group"
          id="username"
          type="text"
          autoSize={{ "minRows": "1", "maxRows": "2" }}
          placeholder="A username to be displayed in your URL"
        />

        <div>
          <div>
            <div>
              <div style={{ padding: '3vh 0px' }}>

                <Button type="primary" color="primary" variant="contained" style={{ width: 120 }}
                  disabled={username === ""}
                  onClick={(event) => { addUserInfoHandler(event, username) }}>
                  {loading ?
                    <CircularProgress size={24} color="white" />
                    :
                    <>
                      Save Profile
                    </>
                  }
                </Button>

                <h4 style={{ margin: "auto", marginTop: '10px', color: "#696969", fontWeight: '300' }}> Want to sign in with a different account?</h4>
                <h4 style={{ fontWeight: "600", color: "#D08B7F" }} onClick={() => {
                  auth.signOut()
                }}>Click Here</h4>
              </div>

            </div>
          </div>
        </div>
      </form>

    </div>

  );
};



export default AccountSetup;
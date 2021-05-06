import firebase from "firebase/app";
import firebaseConfig from "./firebaseConfig"
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

window._fb = firebase;

if (process.env.NODE_ENV === 'development') {
  const functions = firebase.functions()

  functions.useEmulator('localhost', '5001');
  firestore.useEmulator('localhost', '8086');
}

//triggers when signing in with google
export const signInWithGoogle = () => {
  //generates user document if the user has not had one created
  auth
    .signInWithRedirect(
      provider
    )
    .catch(function (error) {
      console.error("Error on signin", error);
    });
};



export default firebase;

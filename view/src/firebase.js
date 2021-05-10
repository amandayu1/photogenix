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

export const getStripeAccountID = async (uid) => {

  var stripeAccountID = "";
  const stripeDocRef = await firestore.doc(
    `sellers/${uid}/privateInfo/stripe`
  );

  await stripeDocRef
    .get()
    .then(function (doc) {
      if (doc.exists) {
        stripeAccountID = doc.data().stripeAccountID;
      }
    })
    .catch(function (err) {
      console.log("the stripedoc does not exist");
      return "";
    });

  console.log(
    "returning this value from getStripeAccountID: " + stripeAccountID
  );

  return stripeAccountID;
};

//takes in uid and gives back all the data for the user document
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`sellers/${uid}`).get();

    return {
      uid,
      ...userDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

//takes in seller id, field name and value and returns nothing
export const addUserDocumentField = async (uid, fieldName, fieldVal) => {
  const sellerRef = firestore.doc(`sellers/${uid}`);
  //const snapshot = await sellerRef.get();
  try {
    await sellerRef.update({
      [fieldName]: fieldVal,
    });
  } catch (err) {
    console.log("addUserDocumentField broke");
    console.log(err);
  }
};

//generates doc in firestore to store single sellers extra data
//returns all the data from the user document
export const generateUserDocument = async (seller) => {
  if (!seller) return;

  //sets seller account id to userRef and gets any data associated with it
  const sellerRef = firestore.doc(`sellers/${seller.uid}`);
  const snapshot = await sellerRef.get();

  //if there is no data associated with the user add their email and pfp
  if (!snapshot.exists) {
    try {
      console.log(seller);
      const userID = seller.uid;
      //if you want to add a field to sellers documents, do it here
      await sellerRef.set({
        initialized: false,
        userID: userID,
        email: seller.email,
        photoURL: seller.photoURL,
        displayName: seller.displayName,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  //returns user document id
  return getUserDocument(seller.uid);
};

//takes in purchase fields, returns purchase document object
export const generatePurchaseDocument = async (
  seller,
  title,
  caption,
  price,
  promoCodes,
  newPhotoURL
) => {
  //you must supply an seller object for this to work
  if (!seller) return;

  try {
    var purchaseRef = await firestore
      .collection(`sellers/${seller.uid}/purchases`)
      .doc();
    //adds new purchase document with generated ID and contents passed by params
    purchaseRef.set({
      title: title,
      caption: caption,
      id: purchaseRef.id,
      ownerID: seller.uid,
      ownerName: seller.displayName,
      price: price,
      photoURL: newPhotoURL,
    });
    promoCodes.forEach(code => {
      let promoCodeRef = firestore
        .collection(`sellers/${seller.uid}/purchases/${purchaseRef.id}/promoCodes`)
        .doc();
      promoCodeRef.set({
        code: code.code,
        discount: code.discount
      })
    })

    //returns a copy of the purchase document, full collection query is set to false
    return getPurchaseDocument(seller.uid, purchaseRef.id);
  } catch (err) {
    console.log("issue creating purchase document");
    console.error(err);
    return null;
  }
};

export const getPromoCodes = async (uid, purchaseID) => {
  try {
    const promoCodeSnapshot = await firestore.doc(`sellers/${uid}/purchases/${purchaseID}`).collection("promoCodes").get();
    return promoCodeSnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error(error);
    console.log(error);
  }
  return null;
};

//takes in purchase+recipient email, adds receipt to collection monitored by mail service
//returns receipt id which is the same as mail id
export const generateReceiptDocument = async (
  sellerId,
  title,
  caption,
  purchaseID,
  recipientEmail,
) => {
  //you must supply an seller object for this to work
  console.log(purchaseID);
  try {
    var receiptRef = firestore.collection(`receipts`).doc();
    //adds new purchase document with generated ID and contents passed by params
    await receiptRef.set({
      title: title,
      caption: caption,
      id: receiptRef.id,
      ownerID: sellerId,
      purchaseID: purchaseID,
      recipientEmail: recipientEmail,
    });
    console.log("receipt has been set");
    //await firestore.doc(`sellers/${seller.uid}/purchases/${purchaseRef.id}`).update({id: purchaseRef.id})
    //returns a copy of the purchase document, full collection query is set to false
    return receiptRef.id;
  } catch (err) {
    console.log("issue creating receipt document");
    console.error(err);
    return null;
  }
};

//takes in a username, returns the user based on that OR sends error email to photogenix
export const getUserByUsername = async (username) => {
  //gets array of users with matching username
  const userQueryArray = await firestore
    .collection(`sellers`)
    .where("username", "==", username)
    //.limit(1)
    .get()
    .then((snapshot) => snapshot.docs.map((x) => x.data()))
    .catch((err) => {
      console.error(err);
    });

  //if the array is empty, sets an error message to be displayed instead of username
  if (!userQueryArray[0]) {
    console.log("No seller was found!");
    return null;
  }

  //sends an error message to photogenix email if there are more than 1 users with that username
  else if (userQueryArray[1]) {
    console.log(
      "There was an issue with this seller, please contact them directly"
    );
    generateErrorDocument(
      "There are 2 or more accounts with duplicate usernames." +
      "the username is:" +
      userQueryArray[0].username +
      "and the first two relevant userIDs are: " +
      userQueryArray[0].uid +
      ", " +
      userQueryArray[1].uid
    );
    return userQueryArray[1];
  }



  return userQueryArray[0];
};

//takes in an error caption and emails it to photogenix for urgent errors
export const generateErrorDocument = async (errorCaption) => {
  //you must supply an seller object for this to work

  try {
    var errorRef = await firestore.collection(`pressingErrors`).doc();
    //adds new purchase document with generated ID and contents passed by params
    errorRef.set({
      body: errorCaption,
    });

    //returns a copy of the purchase document, full collection query is set to false
    return errorRef.id;
  } catch (err) {
    console.log("issue creating errorRef document");
    console.error(err);
    return null;
  }
};

export const getBuyerEmails = (uid, purchaseID, subscriber) => {
  try {
    // console.log("firebase.js", uid, purchaseID);
    const query = firestore.collection('receipts').where('purchaseID', '==', purchaseID).where('ownerID', '==', uid);
    return query.onSnapshot(snap => {
      const receipts = snap.docs.map(receipt => ({
        id: receipt.id,
        email: receipt.data().recipientEmail,
        userID: receipt.data().ownerID,
        purchaseID: receipt.data().purchaseID,
        paymentIntentID: receipt.data().paymentIntentID,
      }));

      subscriber(receipts);
    });

  } catch (error) {
    console.error(error);
    console.log(error);
  }
  return;
};

//a copy of getPurchaseDocument but with subscription
export const getPhotoDocument = (uid, purchaseID, subscriber) => {
  //user id and purchase id must be supplied to ensure logged in
  if (!purchaseID || !uid) return null;
  try {
    //gets the single document using the id
    const query = firestore
      .doc(`sellers/${uid}/purchases/${purchaseID}`)

    //return the purchase ID and its contents
    return query.onSnapshot(snap =>

      subscriber({
        purchaseID,
        ...snap.data(),
      })
    );
  } catch (error) {
    console.error("Error fetching purchase document", error);
  }

};

//gets a single document by purchaseID
//booleann value
export const getPurchaseDocument = async (uid, purchaseID) => {
  //user id and purchase id must be supplied to ensure logged in
  if (!purchaseID || !uid) return null;
  try {
    //gets the single document using the id
    const purchaseDocument = await firestore
      .doc(`sellers/${uid}/purchases/${purchaseID}`)
      .get();

    //return the purchase ID and its contents
    return {
      purchaseID,
      ...purchaseDocument.data(),
    };
  } catch (error) {
    console.error("Error fetching purchase document", error);
  }
};


//deletes the purchase document, required user id and purchase id
export const deletePurchaseDocument = async (purchaseID, uid) => {
  console.log(purchaseID, uid);
  await firestore
    .doc(`sellers/${uid}/purchases/${purchaseID}`)
    .delete()
    .then(function () {
      console.log("Deleted item succesfully");
    })
    .catch(function (err) {
      console.error(err);
    });
};

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

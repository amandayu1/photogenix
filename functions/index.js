const functions = require('firebase-functions');
const express = require('express');
const stripe = require('stripe')(functions.config().stripe.key);
const endpointSecret = functions.config().stripe.endpointsecret;
const admin = require('firebase-admin');
const cors = require('cors')({ origin: false });
const { app, firestore } = require('firebase-admin');

admin.initializeApp();

//This function gets called by stripe webhook on succesful payment
exports.paymentIntentResultHandler = functions.https.onRequest(async (req, res) => {

  //gets the stripe signature to make sure the request is coming from stripe
  const sig = req.headers['stripe-signature'];
  let event;

  console.log('starting constructEvent...');

  try {
    //this is the variable that stores all relevant information for the payment intent
    event = await stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

  }
  catch (err) {
    res.status(400).send(err);
    console.error(err.message);
    return;
  }

  if (event.type === 'payment_intent.succeeded') {

    try {

      //gets purchase info from metadata
      const { purchaseID, ownerID, email } = event.data.object.metadata
      const paymentIntentID = event.data.object.id

      //places all purchase info in object to be passed easily
      const purchaseDetails = {
        purchaseID: purchaseID,
        ownerID: ownerID,
        email: email, //if no email was passed in metadata, it was a mobile payment and was passed through the billing details
        paymentIntentID: paymentIntentID,

      }

      //returns boolean value based on the success of recording purchaseDetails in firestore
      const purchaseSuccesfullyHandled = await handlePurchaseSuccess(purchaseDetails);

      if (purchaseSuccesfullyHandled) {
        console.log('purchase succesfully handled, email is: ' + purchaseDetails.email);
        res.send('success!')
        res.status(200);
        return;
      }
      //returns 400 status to retry in case there was a server error
      else {
        res.status(400);
        res.send('The purchase information was not succesfully stored.');
        return;
      }
    }
    //returns 400 status to retry in case there was a server error
    catch (err) {
      console.error(err);
      res.status(400);
      res.send('failed');
      return;
    }
  }

  //this function only deals with successes, non successes will be sent away
  else {
    console.error(`Unhandled event type ${event.type}`);
    res.send('error');
    return;
  }
});

//accepts purchase data, purchaseID and email and generates a receipt document
//WILL RETURN FALSE IF ERROR
const generateReceiptDocument = async (purchase, purchaseID, email, paymentIntentID = null) => {
  const receiptRef = admin.firestore().collection(`receipts`).doc()

  try {
    console.log({
      title: purchase.title,
      caption: purchase.caption,
      id: receiptRef.id,
      ownerID: purchase.ownerID,
      purchaseID: purchaseID,
      recipientEmail: email,
      paymentIntentID: paymentIntentID,
    });

    receiptRef.set({
      title: purchase.title,
      caption: purchase.caption,
      id: receiptRef.id,
      paymentIntentID: paymentIntentID,
      ownerID: purchase.ownerID,
      purchaseID: purchaseID,
      recipientEmail: email,
    });

    return true;
  }
  catch (err) {
    console.error(err);
    return false;
  }
}

//void async function taking in email
//appends array to include email of sign up
async function recordPurchaseEmail(purchaseDetails) {
  const privatePurchaseDocRef = admin.firestore().doc(`sellers/${purchaseDetails.ownerID}/privateInfo/${purchaseDetails.purchaseID}`);

  try {
    privatePurchaseDocRef.get()
      .then((docSnapshot) => {
        //creates temp buyer array, pushes to it
        //and then resets field to the new array
        if (docSnapshot.exists) {

          var buyerArray = docSnapshot.data().currentBuyerEmails;
          console.log(buyerArray);
          buyerArray.push(purchaseDetails.email);

          privatePurchaseDocRef.update({
            currentBuyerEmails: buyerArray
          });

        } else {
          // create the document, add their email
          // this will trigger if they are the first person to sign up
          privatePurchaseDocRef.set({
            currentBuyerEmails: [purchaseDetails.email]
          })
        }
      });
    return {
      success: 'success',
    }
  }
  catch (err) {
    console.error(err);
    return {
      error: "There was an issue recording your email in our database."
    }
  };
}

//gets price of a purchase using purchaseID and uid depending on price
const getPrice = async (purchaseID, uid, type, selectedPrice, promoCode) => {
  const purchaseDocRef = admin.firestore().doc(`sellers/${uid}/purchases/${purchaseID}`);
  try {
    const purchaseDoc = await purchaseDocRef.get()
    const currency = purchaseDoc.data().price.currency;
    // free photoes or paid photoes without promo codes use price from purchase doc
    let amount = purchaseDoc.data().price.amount;

    // paid photos with promo codes validate code and apply discount rounding to nearest dollar
    if (type === "paid" && selectedPrice) {
      const validPromo = await purchaseDocRef.collection('promoCodes').where('code', '==', promoCode).get();

      if (validPromo.docs.length > 0) {
        const validPromoDoc = validPromo.docs[0];
        amount = Math.round(purchaseDoc.data().price.amount * (100 - validPromoDoc.data().discount) / 100);
      }
      else {
        return stripeError;
      }
    }
    console.log("the amount is: ", amount)
    return {
      amount: amount,
      currency: currency,
    }
  }
  catch (err) {
    console.error(err);
    return null
  }
}

//THIS FUNCTION WILL BE CALLED WHEN CHECKS TO ENSURE purchase CAN BE MADE PASS
const handlePurchaseSuccess = async (purchaseDetails) => {
  const uid = purchaseDetails.ownerID;
  const purchaseID = purchaseDetails.purchaseID;
  const email = purchaseDetails.email;
  const paymentIntentID = purchaseDetails.paymentIntentID || null;
  const purchaseDocRef = admin.firestore().doc(`sellers/${uid}/purchases/${purchaseID}`);

  try {

    //checks if private purchase document exists, creates it if necessary and records the email
    const emailRecord = await recordPurchaseEmail(purchaseDetails);
    if (emailRecord.error) {
      return false;
    }

    const purchaseDocData = await purchaseDocRef.get();
    receiptGeneratedSuccesfully = await generateReceiptDocument(purchaseDocData.data(), purchaseID, email, paymentIntentID);

    //returns true/false depending on the success
    return receiptGeneratedSuccesfully;
  }
  catch (err) {
    console.log("Error editing documents in firestore inside handlePurchaseSuccess");
    console.error(err);
    return false
  }

}
/*
HTTPS FUNCTION TO ALLOW FOR FREE SIGN UP GOES HERE
*/
exports.freeSignUp = functions.https.onCall(async (data, context) => {

  const purchaseDetails = {
    ownerID: data.ownerID,
    purchaseID: data.purchaseID,
    email: data.email,
  }
  console.log(purchaseDetails)

  try {

    //checks if cost is free
    var price = await getPrice(purchaseDetails.purchaseID, purchaseDetails.ownerID);
    const isFree = price.amount ? false : true; //will return true if the price.amount evaluates to 0
    console.log(isFree)

    //only conditions to be met for free sign up
    if (isFree) {
      console.log("entered is free");
      successStatus = await handlePurchaseSuccess(purchaseDetails);
      return {
        success: successStatus
      }
    }
    else {
      return {
        photogenixError: 'This offering cannot accept sign-ups because it is either full or a paid offering.'
      }
    }
  }
  catch (err) {
    console.error(err);
    return {
      photogenixError: "There was an unexpected error. Please reload and try again."
    }
  }

});

//function called when someone intends to pay for a photo
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  console.log(functions.config().stripe.key);
  console.log("Purchase details: ", data.purchaseDetails);
  try {

    //double checks the price from the backend
    const { amount, currency } = await getPrice(data.purchaseDetails.purchaseID, data.purchaseDetails.ownerID, data.purchaseDetails.type, data.purchaseDetails.selectedPrice, data.purchaseDetails.promoCode);

    const application_fee_amount = Math.round(amount * 0.05); //THIS IS THE CUT PHOTOGENIX TAKES FROM THE PAYMENT   
    console.log('the application_fee_amount: ', application_fee_amount);

    //gets the sellers stripe info to make an intent attached to their account
    const stripeDocRef = admin.firestore().doc(`sellers/${data.purchaseDetails.ownerID}/privateInfo/stripe`);
    const stripeAccountID = await getStripeAccountID(stripeDocRef);

    // Create the PaymentIntent
    const intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency.toLowerCase(),
      metadata: {
        integration_check: 'accept_a_payment',
        purchaseID: data.purchaseDetails.purchaseID,
        ownerID: data.purchaseDetails.ownerID,
        email: data.purchaseDetails.email,
        //if its a mobile payment, the email will be included in the billing details
      },
      receipt_email: data.purchaseDetails.email, //this sends a stripe receipt to the payee email
      application_fee_amount: application_fee_amount, //this is the cut photogenix takes
    }, {
      stripeAccount: stripeAccountID //allows connected account to take the money from the charge
    },

    );

    return {
      clientSecret: intent.client_secret,
    };
  }
  catch (e) {
    console.log("stripe error: ", e)
    // Display payment error on client
    return { stripeError: e };
  }
});

exports.retrieveStripeAccountDetails = functions.https.onCall(async (data, context) => {

  const uid = data.uid;
  console.log(uid);
  const stripeDocRef = admin.firestore().doc(`sellers/${uid}/privateInfo/stripe`);
  const sellerRef = admin.firestore().doc(`sellers/${uid}`);
  //fetches seller stripe account id from their document
  stripeAccountID = await getStripeAccountID(stripeDocRef);

  try {

    //uses Stripe API to get the users account object from their id
    const account = await stripe.accounts.retrieve(
      stripeAccountID
    );

    //updates their stripe document with their account object
    await stripeDocRef.update({
      accountObj: account,
      detailsSubmitted: account.details_submitted, //this is the flag that allows them to accept payment
    })

    await sellerRef.update({
      currency: account.default_currency
    });

    return {
      detailsSubmitted: account.details_submitted //returns true or false to determine if they can accept payment
    }
  }

  //THIS MAY BE TRIGGERED IF THERE IS NO STRIPE ACCOUNT ID IN THEIR FILE
  catch (err) {
    console.error(err);
    return {
      error: 'there was an unexpected error'
    };
  }

});


//generates a stripe account link to send them to the connect standard flow
function generateAccountLink(accountID, origin) {
  return stripe.accountLinks.create({
    type: "account_onboarding",
    account: accountID,
    refresh_url: `${origin}/ReturnToWellify`,
    return_url: `${origin}/ReturnToWellify`,
  }).then((link) => link.url);
}

//gets seller account id, returns '' if there is no account id associated with them yet
async function getStripeAccountID(stripeDocRef) {

  try {
    const doc = await stripeDocRef.get();
    //if doc exists, return it. Otherwise, create it.
    if (doc.exists) {
      stripeAccountID = doc.data().stripeAccountID;
      console.log("at line 57: " + stripeAccountID);
      return stripeAccountID;
    }
  }

  catch (err) {
    console.error(err);
    return '';
  }

  return '';
}


//TO BE USED ONLY FOR STRIPE EXPRESS, CURRENTLY PHOTOGENIX USES STRIPE STANDARD
exports.getStripeLoginLink = functions.https.onCall(async (data, context) => {

  const uid = context.auth.uid;
  const stripeDocRef = admin.firestore().doc(`sellers/${uid}/privateInfo/stripe`)
  var stripeAccountID = await getStripeAccountID(stripeDocRef);

  if (!stripeAccountID) {
    return {
      error: 'There is no stripe account associated with this user'
    }
  }

  try {
    const link = await stripe.accounts.createLoginLink(stripeAccountID);
    return link;
  }
  catch (err) {
    console.error(err)
    return {
      error: 'There was an unexoected error retrieving the login link',
      err
    }
  }

});

//generates a link to send users to the stripe connect account flow
exports.getStripeAccountLink = functions.https.onCall(async (data, context) => {
  const origin = context.rawRequest.headers.origin;
  var accountLinkURL = '';

  const uid = context.auth.uid;
  const stripeDocRef = admin.firestore().doc(`sellers/${uid}/privateInfo/stripe`)
  const userDocRef = admin.firestore().doc(`sellers/${uid}`)

  //gets the address and sets the available stripeAccountID
  var stripeAccountID = await getStripeAccountID(stripeDocRef);

  console.log("at line 88: " + stripeAccountID);

  //if there is no stripeAccountID registered with the user create one
  if (!stripeAccountID) {

    //not sure why this is here, but this is a reference to the Stripe API private key
    functions.config().stripe.key

    //IN THE FUTURE you could fill out more information here to make the flow a little easier
    const newStripeAccount = await stripe.accounts.create(
      { type: 'standard' },
    );
    stripeAccountID = newStripeAccount.id;

    //sets the sellers stripe account id in the private document
    await stripeDocRef.set({
      stripeAccountID: stripeAccountID
    });

    //sets the sellers stripe account id in the public document to be used on user checkout
    await userDocRef.update({
      stripeAccountID: stripeAccountID
    });
  }

  //generate accountlink using ID just got
  accountLinkURL = await generateAccountLink(stripeAccountID, origin);

  //return all that info
  return ({
    accountLinkURL: accountLinkURL,
    stripeAccountID: stripeAccountID
  })
});

//cc sellers by uid
exports.onReceiptCreation = functions.firestore.document('receipts/{receiptId}')
  .onCreate(async (snapshot, context) => {
    const itemDataSnap = await snapshot.ref.get()
    const { title, recipientEmail, ownerID, purchaseID, caption, id } = itemDataSnap.data()
    let eventObject;

    //sends an email to recipient, cc the seller
    try {
      console.log('Generating a receipt...');

      const sellerRef = await admin.firestore().doc(`sellers/${ownerID}`).get()
      const sellerData = sellerRef.data();

      if (caption) {
        eventObject.caption = "Caption:\n" + caption;
      }


      

    }
    catch (err) {
      console.error(err)
    }
  });

exports.submitEditProfile = functions.https.onCall(async (data, context) => {
  const db = admin.firestore();
  const uid = context.auth.uid;
  const sellerRef = db.doc(`sellers/${uid}`);
  const seller = await sellerRef.get();
  const currentUsername = (
    (seller.exists && seller.data().username) || ''
  ).toLowerCase();

  // Try updating the username first
  const newUsername = data.username?.trim().toLowerCase();
  if (newUsername !== currentUsername) {
    // Username requires change, check if valid
    if (!/^[a-z0-9._-]+$/.test(newUsername)) {
      throw new functions.https.HttpsError('invalid-argument', 'New username is invalid. Please use only lowercase letters, numbers, dot, underscore, and dash.');
    }

    // Start username unicity check and update
    await db.runTransaction(async (tx) => {

      const usersWithUsername = await tx.get(
        db.collection('sellers').where('username', '==', newUsername)
      )

      if (usersWithUsername.docs.length > 0) {
        const usernameDoc = usersWithUsername.docs[0];
        if (usernameDoc.data().uid !== uid) {
          throw new functions.https.HttpsError('already-exists', 'Username already in use');
        }

        return;
      }

      await tx.set(sellerRef, {
        username: newUsername
      }, { merge: true });
    });
  }

  const newData = {
    initialized: true,
  };
  if (data.photoURL) {
    newData.photoURL = data.photoURL
  }
  if (data.fullName) {
    newData.displayName = data.fullName;
  }

  await sellerRef.update(newData);

  return {
    success: true
  }
});

exports.verifyPromoCode = functions.https.onCall(async (data, context) => {
  const promoCodesRef = admin.firestore().doc(`sellers/${data.uid}/purchases/${data.purchaseID}`).collection("promoCodes");

  try {
    const promoCodesGet = await promoCodesRef.get();
    const promoCodes = promoCodesGet.docs.map(doc => doc.data());
    let result;

    promoCodes.forEach(code => {
      if (code.code === data.promoCode) {
        result = code;
      }
    });
    return result;
  }
  catch (err) {
    console.log("Error in verifying promo code");
    console.error(err);
    return false
  }
});
# Photogenix App Documentation

## Technologies
* ReactJS
* [Firebase](https://firebase.google.com/) for staging and production
* [Stripe Connect](https://stripe.com/docs/connect) 

## Front-end
Top level folder for the front-end is called `view`. The components folder inside src houses `.jsx` files for the visual components. You can see how they are routed inside `App.js`

`firebaseConfig.js` and `config.js` store the firebase config and public Stripe keys.

/ Database
This project uses firestore as its database and firebase functions for calls to the back-end. This project does not need any initial database set-up, it can be run on a blank firestore set-up (eg. when running the emulator) without any set-up.

All back-end functions are currently stored in functions > `index.js`. This is where you will find all of the functions related to the Stripe API as well as purchase sign-ups.

### Data Model
The most complex collection in our database is the `sellers` collection. Each seller that signs in has a document in this collection with id matching their `UID` provided by firebase. 

In an seller document, you have the following
* Public information about the seller stored as fields of the document. A field I would like to point out is `initialized`. This gets set to true once they have completed their account set-up
* A `purchases` collection which stores all public information for their created purchase documents
* A `privateInfo` collection which stores information only accessible by them, including their Stripe Connect account information and contact information for those that have signed up for their purchases. Purchase document id's in this collection match those in the public `purchases` collection.

## Payments
To accept payments, this project uses [Stripe Connect Direct Charges](https://stripe.com/docs/connect/direct-charges) and [a payment intent setup](https://stripe.com/docs/connect/creating-a-payments-page). Relevant files are functions > index.js inside functions, `PaidCheckout.jsx` inside view > Components > Checkout.

Connect accounts for sellers are created on Photogenix using the Stripe API.

Upon any succesful payment, a webhook is called which triggers the process of recording purchase information from data passed into the metadata field of the 'payment intent'. The webhook is setup as a Firebase function. A testing webhook exists for staging, both production and staging signing keys can be found using `firebase functions:config:get -P <default or staging>`

### Setting Up The Project Locally
You need accesss to the following
* Firebase for default and staging
* Stripe

Step 1: Open a terminal at the top level of the cloned repo and run `npm install -g firebase-tools`. The `-g` in this is optional and signifies you will be installing firebase tools globally.

Step 2: Open a terminal at the top level of the cloned repo and `cd` into the `view` folder. From here, run `npm install`

Step 3: `cd` to the top level folder and run `firebase login`. 

Step 4: Install the Stripe CLI and login to it. Ensure your Stripe account is associated with the Photogenix Stripe account before you do this. Follow [this Stripe tutorial](https://stripe.com/docs/stripe-cli#install) up to Step 2.

### Running The Project Locally
This project has several scripts which should be run silmutaneously in order to test on `localhost`. Namely, `npm start`, `npm run emulate`, `npm run stripeHook`. 

* `npm start` can be run from the `view` level folder without further set up
* `npm run emulate` is used to start the firebase emulators and should be run from the root level folder.
* * To use this, ask a developer for the `.runtimeconfig.json` file and put it in the top level folder. This houses our secret test keys for Stripe.
* * Before running this script, run `firebase use default` in your terminal so function calls point to the correct function addresses during emulation

#### Testing Stripe Payments (Using Webhooks)

If you need to test a full payment flow locally you will need to redirect Stripe webhook requests to your local machine. Here is how:
* `npm run stripeHook` redirects succesful payment intent [webhooks](https://stripe.com/docs/webhooks) to your local emulator and should be run from the root level folder when trying to test webhooks for Stripe payments. This command needs to run alongside the previous two. You will need to log into Stripe on your local machine to use this. 
* * Running this command will give you a signing secret in the terminal. Make sure this matches the `endpointsecret` in the `.runtimeconfig.json` file, replace it with your key if it the present one does not match.
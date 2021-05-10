# Photogenix App Documentation

Photogenix is a stock photography image site where you can upload your photos. Others can access
your photos for free or at a price.

# How to use

1. Sign in using Google Authentication
2. Create a seller profile and type in your username
3. Click on the "Create Photo" button to add a new photo
4. Upload your photo, you can add a title and caption!
5. If you want to create a photo with payed access, you need to set up Stripe. To do this, go to
    the Profile Page and click the three dots on the top right.
6. Other people can receive your photo via email. They need to pay with credit card if it's priced.
    To send your profile page to others, copy your username and add it to the end of the URL.
    Eg. http://localhost:3000/@johnsmith

## Technologies
* ReactJS
* [Firebase](https://firebase.google.com/) for staging and production
* [Stripe Connect](https://stripe.com/docs/connect) 

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
* * To use this, you need the `.runtimeconfig.json` file and put it in the top level folder. This houses our secret test keys for Stripe.
* * Before running this script, run `firebase use default` in your terminal so function calls point to the correct function addresses during emulation

#### Testing Stripe Payments (Using Webhooks)
If you need to test a full payment flow locally you will need to redirect Stripe webhook requests to your local machine.

* `npm run stripeHook` redirects succesful payment intent [webhooks](https://stripe.com/docs/webhooks) to your local emulator and should be run from the root level folder when trying to test webhooks for Stripe payments. This command needs to run alongside the previous two. You will need to log into Stripe on your local machine to use this. 
* * Running this command will give you a signing secret in the terminal. Make sure this matches the `endpointsecret` in the `.runtimeconfig.json` file, replace it with your key if it the present one does not match.

`firebaseConfig.js` and `config.js` store the firebase config and public Stripe keys.
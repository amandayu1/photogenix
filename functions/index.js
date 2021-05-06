const functions = require('firebase-functions');
const express = require('express');
const stripe = require('stripe')(functions.config().stripe.key);
const endpointSecret = functions.config().stripe.endpointsecret;
const admin = require('firebase-admin');
const cors = require('cors')({ origin: false });
const { app, firestore } = require('firebase-admin');

admin.initializeApp();

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
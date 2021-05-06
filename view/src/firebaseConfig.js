import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCM1ZnD4feYna61EYv-Xtc3nOxgz5k3CEw",
    authDomain: "photogenix-84f42.firebaseapp.com",
    projectId: "photogenix-84f42",
    storageBucket: "photogenix-84f42.appspot.com",
    messagingSenderId: "510575579075",
    appId: "1:510575579075:web:013c1ee85068aab6c03776",
    measurementId: "G-TVN4LVCXJF"
  };

  const fire = firebase.initializeApp(config)

  export default firebaseConfig;
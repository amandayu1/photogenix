var firebaseConfig = {
    apiKey: "AIzaSyCJxrkbdPypU79Icj9NUT0N937nwGcR3Jg",
    authDomain: "wellifyapp-staging.firebaseapp.com",
    projectId: "wellifyapp-staging",
    storageBucket: "wellifyapp-staging.appspot.com",
    messagingSenderId: "609012346246",
    appId: "1:609012346246:web:214e901e6687081a48d007",
    measurementId: "G-H6BRDGCS27"
};

//firebase config for staging environment
if (window.location.hostname === 'app.wellify.studio' ) {
    firebaseConfig = {
        apiKey: "AIzaSyAIInEae_DQR_MgMuzgMNyis_QluCq-eRE",
        authDomain: "wellifyapp.firebaseapp.com",
        databaseURL: "https://wellifyapp.firebaseio.com",
        projectId: "wellifyapp",
        storageBucket: "wellifyapp.appspot.com",
        messagingSenderId: "11410759693",
        appId: "1:11410759693:web:5cbaad258121c0a097f544",
        measurementId: "G-ZHLGSBSQFZ",    
    }; 
}

export default firebaseConfig;
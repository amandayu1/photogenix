import React, {Component, createContext} from "react";
import { auth as userAuth, getUserDocument} from "../firebase";
import firebase from "firebase/app";

//creates context of user that can be used in all child components
export const UserContext = createContext({ 
    user:null,
    updateContext: () => {},
});

class UserProvider extends Component {

    state={
        user:null,
   
        initialized: false
    };

    updateContext = async (userAuth) => {
        var userDocument = null;

            if (userAuth) { 
                try {
                    userDocument = await getUserDocument(userAuth.uid);
                    console.log(userDocument);
                    /* console.log("printing user document from update context");
                    console.log(userDocument); */
                }
                catch (err) {
                    console.log("error updating user context to userdoc");
                    console.error(err);
                }
            }
        console.log(userDocument);
            //set user state to userDocument object 
            //******THIS MAY JUST COLLECT THE OBJECT, NOT THE REFERENCE TO THE DOCUMENT */
        await this.setState({
            user: userDocument,
            initialized: true,
        });
    }
    
    

    //when component mounts set user state piece to userAuth status 
    componentDidMount = async () => {

        if (process.env.NODE_ENV === 'development') {
            const functions = firebase.functions()
            functions.useFunctionsEmulator('http://localhost:5001')
        }
        console.log(userAuth.currentUser)
        
        //triggers when the user signs in or out
        userAuth.onAuthStateChanged( async userAuth => {

            //dont update context if user is anonymous
            if (userAuth && !userAuth.displayName) {
                //console.log("signing out:"+userAuth);
                //auth.signOut();
                this.setState({
                    initialized: true,
                })
            }
            //update context if user is anonymous
            else {
                console.log("updating context...");
                this.updateContext(userAuth);
            }
              

        });

    };

    //provides user state to all children
    render() {
        return (
            <UserContext.Provider value={{
                initialized: this.state.initialized,
                user: this.state.user,
           
                updateContext: this.updateContext}}>
                {this.props.children}
            </UserContext.Provider>
        );
    }

}

export default UserProvider;


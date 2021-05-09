import React, { Component } from "react";
import { UserContext } from "../providers/UserProvider";
import { withRouter } from 'react-router';
import { auth } from '../firebase';
import firebase from "firebase/app";
import LoadingPage from "./LoadingPage";


class StripeReturnPage extends Component {

    static contextType = UserContext
    constructor(props) {
        super(props)

        this.state={
            detailsSubmitted:''
        }

        
    }

    componentDidMount = async () => {

        var retrieveStripeAccountDetails = firebase.functions().httpsCallable('retrieveStripeAccountDetails');

        auth.onAuthStateChanged( async user => {
            console.log("entered on auth state changed");
            if(user) {
                console.log("retrieving stripe information right now");
                console.log(user.userID);
                retrieveStripeAccountDetails({
                    uid: user.userID,
                })
                .then((result) => {
                    console.log("updating state with detailsSubmitted...")
                    console.log(result);
                    if(!result.error){
                        this.setState({
                            detailsSubmitted: result.data.detailsSubmitted
                        });
                    }
                    
                })
                .then( () => {
                    console.log("updated!");
                    window.location = ("/ProfilePage")
                })  
            }
        })

        
    }

    render() {
        return (
            <React.Fragment>
                <LoadingPage />
                
            </React.Fragment>
        )
    }
}

export default withRouter(StripeReturnPage);




import React, { Component } from "react";
import { auth, firestore } from "../firebase";
import PhotoCard from "./Card";
import 'antd/dist/antd.css';
import "./CardContainer.css";

//This places the center of the first item right in the middle of the screen by default

const cardStyles = {
    marginBottom: 30,
}
const emptyStateText = {
    color: '#4B4B4B',
    marginTop: '5.625rem',
    marginBottom: '1.1875rem',
    fontSize: "1.125rem",
    fontWeight: "300"
}
const headerText = {
    color: '#4B4B4B',
    marginTop: '1.875rem',
    marginBottom: '0',
    fontSize: "1.5rem",
    fontWeight: "300"
}

class PurchasesContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            purchaseDocuments: [],
            spacerStyles: {
                paddingLeft: '',
                scrollSnapAlign: "center",
                flexGrow: "1",
            },
        }
    }

    //on mount, load all the relevant purchase documents into scheduled photo cards
    componentDidMount = async () => {

        //sets the correct padding based on the window
        const paddingWidth = (window.innerWidth) / 2 - (20 * parseFloat(getComputedStyle(document.documentElement).fontSize)) / 2
        await this.setState(prevState => ({
            spacerStyles: {
                ...prevState.spacerStyles,
                paddingLeft: paddingWidth,
            }
        }))

        // save reference of object to this.unsubscribe, call in componentWillUnmount to unsubscribe to data changes
        this.unsubscribe = firestore.collection(`sellers/${this.props.uid}/purchases`)
            .onSnapshot(this.purchaseChanges)
    }

    componentWillUnmount() {
        this.unsubscribe();
        // unsubscribe from data changes
    }

    purchaseChanges = (purchasesCollection) => {
        //this is a function to map the array purchasesCollectionRef to components
        try {
            //this const will be set as a state piece to be rendered
            const purchaseDocuments = purchasesCollection.docs
                .map((purchase) => {
                    purchase = purchase.data();

                    return (<PhotoCard
                        ownerName={purchase.ownerName}
                        ownerUserName={this.props.ownerUserName}
                        title={purchase.title}
                        caption={purchase.caption}
                        id={purchase.id}
                        key={purchase.id}
                        ownerID={purchase.ownerID}
                        purchaseRequestHandler={this.props.purchaseRequestHandler}
                        isPublic={(auth.currentUser && auth.currentUser.uid === purchase.ownerID) ? false : true}
                        price={purchase.price}
                        stripeAccountID={this.props.stripeAccountID}
                        photoURL={purchase.photoURL}
                    />);
                });


            this.setState({
                purchaseDocuments: purchaseDocuments
            })

        }
        catch (err) {
            console.error(err);
        }
    }

    render() {

        if (this.state.purchaseDocuments && this.state.purchaseDocuments.length === 0
        ) {
            if (this.props.ownerName) {
                return (
                    <div className="textDesc">
                        <h2 style={emptyStateText}>
                            This seller doesn’t have any photos yet.
                        </h2>
                    </div>
                );
            }
            else {
                return (
                    <div className="textDesc">
                        <h2 style={emptyStateText}>
                            You don’t have any photos posted yet.
                        </h2>
                    </div>
                );
            }
        }

        //renders each photo offering
        return (
            <React.Fragment>
                {this.props.ownerName ?
                    <div className="textDesc">
                        <h2 style={headerText}>
                            Select from the Photo Gallery
                        </h2>
                    </div>
                    :
                    <div className="textDesc">
                        <h2 style={headerText}>
                            Your Photo Gallery
                        </h2>
                    </div>
                }

                <div className="CardsContainer" >
                    {this.state.purchaseDocuments.map((card, key) => {
                        return (
                            <div>
                                <div
                                    className="card"
                                    id={card.id}
                                    key={key}
                                    style={cardStyles}
                                >
                                    {card}
                                </div>
                            </div>
                        )
                    })
                    }
                </div>

            </React.Fragment>

        )
    }
}

export { PurchasesContainer };
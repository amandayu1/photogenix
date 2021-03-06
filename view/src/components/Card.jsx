import React, { Component } from "react";
import { auth, deletePurchaseDocument } from "../firebase"
import 'antd/dist/antd.css';
import { Card } from '@material-ui/core';
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import LogoIcon from "../assets/upload.jpg";

const useStyles = theme => ({
    root: {
        maxWidth: '350px',
        margin: 'auto'
    },
    photoCard: {
        border: '3px solid #f3b0bfe0',
        borderRadius: '5px',
        boxShadow: '0px 2px 5px 2px rgba(243, 176, 191, 0.1)',
        height: '33em',
        margin: '3% auto',
        
        "&:hover": {
            boxShadow: '0px 2px 5px 2px rgba(243, 176, 191, 0.4)'
        },
        "&:active": {
            background: '#F0F0F0'
        }
    },
    buyerCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '15px 10px',
        textAlign: 'left',
        fontFamily: 'Assistant',
    },

    virtualIcon: {
        float: 'right',
        verticalAlign: 'middle'
    },
    title: {
        fontSize: '20px',
        color: theme.palette.primary.main,
        fontWeight: '600',
        position: 'relative',
        maxHeight: '4rem',
        overflow: 'hidden',
        width: '100%',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        "-webkitLineClamp": '2',
        "-webkitBoxOrient": 'vertical',
        paddingLeft: 40,
        paddingTop: 30,
    },
    price: {
        fontSize: '18px',
        color: '#D08B7F',
        fontWeight: '600',
        float: 'right',
        paddingRight: 40,
    },

    desc: {
        fontSize: '0.875rem',
        fontWeight: '400',
        color: '#767676',
        verticalAlign: 'middle',
        overflow: 'hidden',
        display: '-webkit-box',
        "-webkitLineClamp": '2',
        "-webkitBoxOrient": 'vertical',
        paddingLeft: 40,
    },
    photo: {
      width: '300px',
      height: '300px',
      margin: 'auto',
    },

    "@media screen and (max-width: 425px)": {
        photo: {
            width: '200px',
            height: '200px'
        },
        photoCard: {
            height: '23rem', 
        },
    }
});

class PhotoCard extends Component {
    constructor(props) {
        super(props);

        //all fields that can be displayed on the schedule photo card
        this.state = {
            //stores card fields in object to be easily passed around
            cardObj: {
                title: this.props.title,
                caption: this.props.caption,
                purchaseID: this.props.id,
                ownerID: this.props.ownerID,
                ownerName: this.props.ownerName,
                ownerUserName: this.props.ownerUserName,
                isPublic: this.props.isPublic,
                price: this.props.price,
                stripeAccountID: this.props.stripeAccountID,
                photoURL: this.props.photoURL,
            },
            isDeleted: false,
        }
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    }

    //makes sure that nothing renders if the required fields havent been loaded
    requiredFieldsDidMount() {
        if (this.state.cardObj.title) return true;
        return false;
    }

    //deletes this card document
    handleDeleteSubmit() {
        //prevents non logged in users from attempting a delete which would throw an error
        if (this.state.cardObj.isPublic) return;

        //makes it so the card doesnt render anything
        this.setState(prevState => ({
            cardObj: {
                ...prevState.cardObj,
            },
            isDeleted: true
        }));
        //deletes this document
        deletePurchaseDocument(this.state.cardObj.purchaseID, auth.currentUser.uid);
    }

    redirectToDetails = () => {
        // dynamic url here 
        window.location = `/ProfilePage/photo=${this.state.cardObj.purchaseID}`;
    }

    render() {
        const { classes } = this.props;
        //checks to make sure all the required information is there
        if (!this.requiredFieldsDidMount) {
            return (<p>loading!</p>)
        }

        //will get triggered when isDeleted is changed by handleDeleteSubmit()
        else if (this.state.isDeleted) return null;

        //this is the component view if isPublic conditions are met
        if (this.state.cardObj.isPublic) {

            return (
                <React.Fragment>
                    <div className={classes.root}>
                        <Link onClick={() => this.props.purchaseRequestHandler(this.state.cardObj)}>
                            <Card className={classes.photoCard}>
                                
                                <div className={classes.photo} style={{ 
                                    background: `url(${this.state.cardObj.photoURL || LogoIcon})  no-repeat center center`,
                                    backgroundSize: "cover"}}>
                                </div>

                                <div className={classes.buyerCard}>
                                    
                                    <div className={classes.title}>
                                        {this.state.cardObj.title}
                                    </div>

                                    <div className={classes.desc}>
                                        {this.state.cardObj.caption}
                                    </div>

                                    <div>

                                        <span className={classes.price}>
                                            {this.state.cardObj.price.type === 'paid' &&
                                                '$' + (this.state.cardObj.price.amount / 100).toFixed(2) + ' ' + this.state.cardObj.price.currency.toUpperCase()}
                                        </span>
                                        <span className={classes.price}>
                                            {this.state.cardObj.price.type === 'free' && "Free"}
                                        </span>

                                    </div>

                                </div>
                            </Card>
                        </Link>
                    </div>
                </React.Fragment>
            )
        }

        //component view for sellers that own this card
        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Link onClick={this.redirectToDetails}>
                        <Card className={classes.photoCard}>
                            <div className={classes.buyerCard}>
                            
                            <div className={classes.photo} style={{ 
                                    background: `url(${this.state.cardObj.photoURL || LogoIcon})  no-repeat center center`,
                                    backgroundSize: "cover"}}>
                                </div>

                                <div className={classes.title}>
                                    {this.state.cardObj.title}
                                </div>

                                <div className={classes.desc}>
                                    {this.state.cardObj.caption}
                                </div>

                                <div>

                                    <span className={classes.price}>
                                        {this.state.cardObj.price.type === 'paid' &&
                                            '$' + (this.state.cardObj.price.amount / 100).toFixed(2) + ' ' + this.state.cardObj.price.currency.toUpperCase()}
                                    </span>
                                    <span className={classes.price}>
                                        {this.state.cardObj.price.type === 'free' && "Free"}
                                    </span>

                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            </React.Fragment>
        )
    }
}
export default withStyles(useStyles)(PhotoCard);
import React, { Component } from 'react';
import { deletePurchaseDocument } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import BuyerList from "./BuyerList.jsx"
import PhotoDetailsInfo from "./PhotoDetailsInfo.jsx";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import "./PhotoDetails.css";
import { Button, IconButton, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

class PhotoDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: null,
            purchaseID: null,
            isDeleted: false,
            isModalVisible: false,
            isMenuClosed: null,

            popOpen: false,
            message: "Sucess",
            severity: "success",
        }
    }
    static contextType = UserContext;
    componentDidMount = async () => {

        const user = this.context;
        console.log('ctx', user);

        this.setState({
            userID: user.user["uid"],
            purchaseID: this.props.computedMatch.params.id,
        })

    }
    redirectToProfilePage = () => {
        window.location = `/ProfilePage/`;
    }
    handleDelete = () => {
        if (this.state.isDeleted === false) {
            this.setState({
                isDeleted: true,
            })
            deletePurchaseDocument(this.state.purchaseID, this.state.userID).then(() => {
                this.redirectToProfilePage();
            })
            return;
        }
        return;
    }
    getEmails = (value) => {
        this.setState({
            buyerEmails: value,
        })
    }

    showModal = () => {
        this.handleClose();
        this.setState({
            isModalVisible: true,
        })
    }
    handleOk = () => {
        this.handleClose();
        this.handleDelete();
        this.setState({
            isModalVisible: false,
        })
    };
    handleCancel = () => {
        this.handleClose();
        this.setState({
            isModalVisible: false,
        })
    }
    handlePopClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            popOpen: false,
        })
    };
    handleClick = (event) => {
        this.setState({
            isMenuClosed: event.currentTarget,
        });
    };
    handleClose = () => {
        this.setState({
            isMenuClosed: null,
        })
    };
    render() {
        if (this.state.userID === null) {
            return null;
        }
        return (
            <>
                <div className="header">
                    <Button className="back-to-browse" color="primary" onClick={this.redirectToProfilePage}>
                        <ArrowBackIosIcon />
                        <span>Back</span>
                    </Button>
                </div>
                <span className="photo-menu">
                    <IconButton color="primary" onClick={this.showModal}>
                        <DeleteIcon fontSize="large" />
                    </IconButton>
                </span>

                {/* the popup */}

                <Dialog
                    open={this.state.isModalVisible}
                    onClose={this.handleCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-caption"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-caption">
                            By deleting this, you will lose access to
                            all of the information including the buyers' emails.
                            It will be your responsibility to reimburse buyers
                            and notify them of this change.
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={this.handleOk} color="primary" autoFocus>
                            OK
                    </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={this.state.popOpen}
                    onClose={this.handlePopClose}
                    autoHideDuration={3000}
                    action={
                        <IconButton size="small" aria-label="close" color="inherit" onClick={this.handlePopClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <Alert onClose={this.handlePopClose} severity={this.state.severity}>
                        {this.state.message}
                    </Alert>
                </Snackbar>
                {/* </div> */}
                <div className="side-padding photo-info">
                    <PhotoDetailsInfo userID={this.state.userID} purchaseID={this.state.purchaseID} />
                </div>
                <div className="side-padding buyer-list">
                    <BuyerList
                        userID={this.state.userID}
                        purchaseID={this.state.purchaseID}
                        passEmails={this.getEmails}
                    />
                </div>
            </>
        );
    }
}

export default PhotoDetails;
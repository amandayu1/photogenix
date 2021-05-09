import React, { useContext, useState, useRef } from 'react';
import "./PhotoDetails.css";
import { UserContext } from "../providers/UserProvider";
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as LogoIcon } from "../assets/logo.svg";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@material-ui/core';

const UploadPhoto = () => {

    //deconstructs fields from the firestore user document that is given through context
    const { user } = useContext(UserContext);
    const { photoURL, uid } = user;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const uploadedImage = useRef({});
    const imageUploader = useRef(null);
    const [uploadedImageSrc, setUploadedImageSrc] = useState(null);

    const useStyles = makeStyles((theme) => ({
        buttonSubmit: {
            marginTop: "5%",
            width: '10ch',
        },
        input: {
            display: 'none',
        },
        form: {
            padding: theme.spacing(2.5),
            maxWidth: 800,
            margin: 'auto',
            '& > *': {
                marginBottom: theme.spacing(2)
            }
        },
      
        uploadPhotoContainer: {
            marginTop: "1rem",
            marginBottom: "2rem",
        },
        uploadPhoto: {
            fontSize: "1rem",
            color: "#E57D6F",
            cursor: "pointer",
            display: 'inline',
        },
        editTitle: {
            fontSize: "1.5rem",
            color: '#4B4B4B',
            textAlign: 'center',
            marginTop: '5%',
        },
        header: {
            paddingTop: "4%",
            textAlign: "left",
            height: "2rem",
        },
        buttonProgress: {
            color: "green",
            position: 'absolute',
            top: '58%',
            left: '48.5%',
        },
        wrapper: {
            margin: theme.spacing(1),
            position: 'relative',
        },
        photo: {
            background: `url(${uploadedImageSrc || photoURL || <LogoIcon />})  no-repeat center center`,
            backgroundSize: "cover",
            width: '150px',
            height: '150px',
            // borderRadius: "100000px",
            margin: 'auto',
        },
        "@media screen and (max-width: 425px)": {
            photo: {
                width: '100px',
                height: '100px'
            },
        }
    }));

    const handleImageUpload = e => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            const { current } = uploadedImage;
            current.file = file;
            reader.onload = e => {
                setUploadedImageSrc(e.target.result)
            };
            reader.readAsDataURL(file);
        }
    };

    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const submitForm = async () => {
       
        
           
        
    }

    return (
        <div>
            <div className={classes.header}>
                
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-caption"
                >
                    <DialogTitle id="alert-dialog-title">{"Discard Changes?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-caption">
                            This information will not be saved
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => { window.location = `/ProfilePage/` }} color="primary">
                            Discard
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div className={classes.photo}></div>

            <div className={classes.uploadPhotoContainer}>
                <label htmlFor="profile-img-file" className={classes.uploadPhoto} >Upload Photo</label>
            </div>

            <input
                type="file"
                accept="image/*"
                className={classes.input}
                id="profile-img-file"
                onChange={handleImageUpload}
                ref={imageUploader}
            />


            <form className={classes.form} noValidate autoComplete="off"  >

                <div className={classes.wrapper}>
                    <Button variant="contained" color="primary" className={classes.buttonSubmit}
                        disabled= {loading} onClick={submitForm}>
                        Save
                </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
            </form>
        </div>

    );
}

export default UploadPhoto;

import React, { useContext, useState, useRef } from 'react';
import "./PhotoDetails.css";
import { UserContext } from "../providers/UserProvider";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as LogoIcon } from "../assets/logo.svg";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { getUserByUsername, storage } from '../firebase';
import firebase from "firebase/app";

const EditProfile = () => {

    //deconstructs fields from the firestore user document that is given through context
    const { user } = useContext(UserContext);

    const { photoURL, bio, displayName, username, uid } = user;

    const [usernameValue, setUsernameValue] = useState(username);
    const [nameValue, setNameValue] = useState(displayName);
    const [bioValue, setBioValue] = useState(bio);
    const [usernameValid, setUsernameValid] = useState(true);
    const [usernameError, setUsernameError] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const regex = /^[a-z0-9._-]+$/

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
        backToBrowse: {
            cursor: "pointer",
            paddingLeft: "5%",
            paddingRight: "5%",
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
            borderRadius: "100000px",
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

    const handleUserNameChange = (event) => {
        // handles username being only number and lowercase letters  
        if (regex.test(event.target.value) || event.target.value === "") {
            setUsernameValue(event.target.value);
        }
    };
    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    };
    const handleBioChange = (event) => {
        setBioValue(event.target.value);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const submitForm = async () => {
        const usernameIsFree = await validateUsername(username);
        if (usernameIsFree) {
            if (!loading) {
                setLoading(true);
                const submitEditProfile = firebase.functions().httpsCallable('submitEditProfile');

                let newPhotoURL = null
                if (uploadedImage.current.file) {
                    const snapshot = await storage.ref().child("profilePictures/" + uid + "/photo").put(uploadedImage.current.file)
                    newPhotoURL = await snapshot.ref.getDownloadURL()
                }

                await submitEditProfile({
                    username: usernameValue,
                    fullName: nameValue,
                    bio: bioValue,
                    photoURL: newPhotoURL,
                })
                setLoading(false);
                window.location = `/ProfilePage/`;
            }
        }
    }
    const validateUsername = async () => {
        //prevents any submissions that violate username requirements
        if (username === usernameValue) {
            return true;
        }
        const usersMatchingUsername = await getUserByUsername(usernameValue);
        if (usersMatchingUsername) {
            setUsernameError("This username has been taken, try a different one.");
            setUsernameValid(false);
            return false;
        }
        setUsernameError("");
        setUsernameValid(true);
        return true;
    }

    return (
        <div>
            <div className={classes.header}>
                <Button className={classes.backToBrowse} color="primary" onClick={handleClickOpen}>
                    <ArrowBackIosIcon />
                    <span>Back</span>
                </Button>
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
            <h1 className={classes.editTitle}>
                Edit Profile
            </h1>

            <div className={classes.photo}></div>

            <input
                type="file"
                accept="image/*"
                className={classes.input}
                id="profile-img-file"
                onChange={handleImageUpload}
                ref={imageUploader}
            />
            <div className={classes.uploadPhotoContainer}>
                <label htmlFor="profile-img-file" className={classes.uploadPhoto} >Upload Photo</label>
            </div>

            <form className={classes.form} noValidate autoComplete="off"  >
                <TextField
                    fullWidth
                    error={!usernameValid}
                    helperText={usernameError}
                    id="standard-basic" required label="Username"
                    placeholder="app.photogenix.studio/@username" value={usernameValue}
                    defaultValue={username} onChange={handleUserNameChange}
                    inputProps={{ maxLength: 25 }}
                />
                <TextField
                    fullWidth
                    id="standard-basic" required label="Full Name"
                    placeholder="Full Name" value={nameValue}
                    defaultValue={displayName} onChange={handleNameChange}
                />
                <TextField
                    fullWidth
                    id="standard-multiline-flexible" label="Bio"
                    placeholder="Where you are, what you teach and why you love it" value={bioValue}
                    rowsMax={7} multiline onChange={handleBioChange}

                />
                <div className={classes.wrapper}>
                    <Button variant="contained" color="primary" className={classes.buttonSubmit}
                        disabled={usernameValue === "" || nameValue === "" || loading} onClick={submitForm}>
                        Save
                </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
            </form>
        </div>

    );
}

export default EditProfile;

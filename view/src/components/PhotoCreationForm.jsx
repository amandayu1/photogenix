import React, { useState, useContext, useRef } from 'react';
import { UserContext } from "../providers/UserProvider";
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import { Button, FormControlLabel, makeStyles, Radio, RadioGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { generatePurchaseDocument, auth } from '../firebase';
import { Redirect } from "react-router-dom";
import { Alert } from '@material-ui/lab';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import "./PhotoDetails.css";
import { storage } from '../firebase';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      decimalScale={2}
    />
  );
}

function PhotoCreationForm({ isStripeEnabled }) {

    //deconstructs fields from the firestore user document that is given through context
    const { user } = useContext(UserContext);
    const { currency, uid } = user;

    const uploadedImage = useRef({});
    const imageUploader = useRef(null);
    const [uploadedImageSrc, setUploadedImageSrc] = useState(null);

  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [paidPrice, setPaidPrice] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validForm, setValidForm] = useState(null);
  const [validPayment, setValidPayment] = useState(null);
  const [validCodes, setValidCodes] = useState(null);
  const [selectedPayment, setselectedPayment] = useState('paid');
  const [open, setOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [numberOfPromos, setNumberOfPromos] = useState(0);

  const numberRegex = /^[0-9\b]+$/;

  const useStyles = makeStyles((theme) => ({
    form: {
      padding: theme.spacing(2.5),
      maxWidth: 800,
      margin: 'auto',
      '& > *': {
        marginBottom: theme.spacing(2)
      }
    },
    title: {
      textAlign: 'left',
      color: theme.palette.primary.main,
      fontSize: '1.5rem',
      display: 'inline',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonCreate: {
      marginTop: '20px',
    },
    radioButtons: {
      display: 'block',
    }, margin: {
      marginBottom: '20px',
      marginTop: '10px',
    },
    infoIcon: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '20px',
      marginBottom: '10px'
    },
    exit: {
      position: 'relative',
      textAlign: 'left',
      marginTop: '2.5%',
      marginLeft: '3%',
    },
    addPromo: {
      fontSize: '16px',
    },
    addPromoIcon: {
      color: theme.palette.primary.main,
      fontSize: 'x-large',
      padding: '0'
    },
    promoCodeContainer: {
      marginTop: '20px',
      display: 'inline-flex',
      width: '100%'
    },
    promoCode: {
      width: '55%',
      marginLeft: '3%'
    },
    discount: {
      width: '30%',
      marginLeft: '3.5%'
    },
  input: {
      display: 'none',
  },
  uploadPhotoContainer: {
      marginTop: "1rem",
      marginBottom: "2rem",
  },
  uploadPhoto: {
      fontSize: "1rem",
      color: "#f3b0bfe0",
      cursor: "pointer",
      display: 'inline',
  },

  photo: {
      background: `url(${uploadedImageSrc })  no-repeat center center`,
      backgroundSize: "cover",
      width: '150px',
      height: '150px',
      margin: 'auto',
  },
  "@media screen and (max-width: 425px)": {
      photo: {
          width: '100px',
          height: '100px'
      },
  }
  }));  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  // RADIO BUTTONS 
  const handlePayment = (event) => {
    setselectedPayment(event.target.value);
  };

  const handlePromoCode = (e) => {
    let newArr = [...promoCodes];
    newArr.forEach(promoCode => {
      if (promoCode.index.toString() === e.target.id) {
        promoCode.code = e.target.value;
      }
    });
    setPromoCodes(newArr);
  };

  const handleDiscount = (e) => {
    if ((e.target.value === '' || numberRegex.test(e.target.value)) && e.target.value < 101) {
      let newArr = [...promoCodes];
      newArr.forEach(promoCode => {
        if (promoCode.index.toString() === e.target.id) {
          promoCode.discount = e.target.value;
        }
      });
      setPromoCodes(newArr);
    }

  };
  const handleAddPromoCode = () => {
    setNumberOfPromos(numberOfPromos + 1);
    const newPromoCode = { code: "", discount: "", index: numberOfPromos };
    setPromoCodes([...promoCodes, newPromoCode]);
  };

  const handleRemovePromoCode = index => {
    setPromoCodes(promoCodes.filter(item => item.index !== index));
  };

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

  // this function called when form is submitted
  async function handleSubmit(event) {
    let isFormValid = true;
    let isValidPayment = true;
    let isValidCodes = true;

    if (titleValue === '') {
      isFormValid = false;
    }

    if (selectedPayment === 'paid') {
      if (paidPrice === '') {
        isFormValid = false;
      }
    }

    promoCodes.forEach(promoCode => {
      if (promoCodes.length > 1) {
        // check if promo code has duplicate
        const checkRepeated = promoCodes.filter(item => item.code === promoCode.code);
        if (checkRepeated.length > 1) {
          isValidCodes = false;
        }
      }
      if (promoCode.code === "" || promoCode.discount === "") {
        isFormValid = false;
      }
    });

    setValidForm(isFormValid);
    setValidPayment(isValidPayment);
    setValidCodes(isValidCodes);

    if (isFormValid === true && isValidPayment === true && isValidCodes === true) {

      //required, do not change this
      event.preventDefault()

      //makes state variables a little easier to access for purchase generation
      const user = auth.currentUser;

      promoCodes.forEach(promoCode => {
        delete promoCode['index'];
      });

      var price = { type: selectedPayment };

      if (selectedPayment === 'paid') {
        price.amount = paidPrice * 100;
        price.currency = currency.toUpperCase();
      }

      try {
        // uploads photo
        if (uploadedImage.current.file) {
          const snapshot = await storage.ref().child("images/" + uid + "/photo").put(uploadedImage.current.file)
          let snapshotPhotoURL =  await snapshot.ref.getDownloadURL();

          //generates a purchase doc with all state variables and user photo as validation
          const purchaseDoc = await generatePurchaseDocument(
            user, titleValue, descValue || 999, price, promoCodes, snapshotPhotoURL
          );
          
        console.log("purchaseDoc: ", purchaseDoc);
      }
      } catch (err) {
        console.error(err);
        alert("There was an issue with submission, please try again");
      }
      //tells react to leave here and render profile page
      setFormSubmitted(true);
    }
  }

  return (
    <div>
      <div className={classes.exit}>
        <Button color="primary" onClick={handleClickOpen}>
          <ArrowBackIosIcon />
          <span>Profile Page</span>
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-caption"
        >
          <DialogTitle id="alert-dialog-title">{"Discard Form?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-caption">
              This information will not be saved
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
              </Button>
            <Button onClick={() => { window.location = `/ProfilePage/` }}
              color="primary" autoFocus>
              Discard
              </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className={classes.form}>

        <div className={classes.checkboxGroup}>
    
          <div className={classes.title}>
            <b>Add a Photo</b>
          </div>
        </div>

        {/* Upload photo */}
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

        <TextField
          value={titleValue}
          onChange={(event) => { setTitleValue(event.target.value) }}
          label="Title"
          inputProps={{ maxLength: 100 }}
          required
          fullWidth
        />

        <TextField
          placeholder='Short and sweet description of image'
          value={descValue}
          id="standard-multiline-flexible"
          onChange={(event) => { setDescValue(event.target.value) }}
          label="Photo Caption"
          rowsMax={7}
          rows={2}
          multiline
          fullWidth
        />

        <div >
          <RadioGroup className={classes.radioButtons} row aria-label="position" name="position">
            <FormControlLabel
              defaultValue="paid"
              value="paid"
              control={<Radio
                color="primary"
                checked={selectedPayment === 'paid'}
                onChange={handlePayment}
                inputProps={{ 'aria-label': 'FIXED' }}
              />}
              label="Paid"
              labelPlacement="top"
            />
            <FormControlLabel
              defaultValue="paid"
              value="free"
              control={<Radio
                color="primary"
                checked={selectedPayment === 'free'}
                onChange={handlePayment}
                inputProps={{ 'aria-label': 'FREE' }}
              />}
              label="Free"
              labelPlacement="top"
            />

          </RadioGroup>
        </div>

        {/* Free */}
        {selectedPayment === 'free' ?
          <div>
            <p>Your buyers will not have to pay to receive the photo!</p>

            {validForm === false ?
              <Alert severity="error">
                <strong>Error! </strong>
                       Please correctly fill out all required fields
              </Alert>
              : null
            }

            <Button className={classes.buttonCreate}
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Save Photo
            </Button>
            {formSubmitted === true && validForm === true && validPayment === true ?
              <Redirect to="/ProfilePage" />
              : null
            }
          </div>
          : null
        }

        {/* Paid */}
        {selectedPayment === 'paid' ?
          <div>
            {isStripeEnabled ?

              <div>
                <p>This feature allows you to set a paid price per class!</p>
                <div className={classes.photo}>
                  <img src={paid} alt="test" width="400" />
                </div>
                <p>Here's an example of what your buyers will see</p>

                <TextField
                  required
                  fullWidth
                  id="outlined-adornment-amount"
                  className={classes.margin}
                  label="Price Per Photo"
                  value={paidPrice}
                  onChange={(event) => setPaidPrice(event.target.value)}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                <div className={classes.checkboxGroup}>
                  <IconButton className={classes.addPromoIcon} onClick={handleAddPromoCode}>
                    <AddBoxIcon />
                  </IconButton>
                  <Button
                    color="default"
                    disableRipple
                    className={classes.addPromo}
                    onClick={handleAddPromoCode}
                  >
                    Add Promo Code
                  </Button>
                </div>
                <div>
                  {promoCodes.map(promo =>
                    <div className={classes.promoCodeContainer}>
                      <IconButton className={classes.addPromoIcon} onClick={() => handleRemovePromoCode(promo.index)}>
                        <IndeterminateCheckBoxIcon />
                      </IconButton>
                      <TextField
                        required
                        className={classes.promoCode}
                        id={promo.index}
                        label="Promo Code"
                        variant="outlined"
                        value={promo.code}
                        onChange={handlePromoCode}
                        placeholder="e.g. NEW20"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        required
                        className={classes.discount}
                        id={promo.index}
                        label="Discount"
                        value={promo.discount}
                        onChange={handleDiscount}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">%</InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  )}
                </div>


                <div className={classes.infoIcon}>
                  <InfoIcon />
                  <span>
                    &nbsp;Photogenix takes 5%, Stripe charges 30¢ + 2.9%, for international currency transactions, fees may vary
                </span>
                </div>

                {validForm === false && validCodes === true ?
                  <Alert severity="error">
                    <strong>Error! </strong>
                    Please correctly fill out all required fields
                    </Alert>
                  : null
                }

                {validCodes === false ?
                  <Alert severity="error">
                    <strong>Error! </strong>
                       Cannot have duplicate promo codes
                  </Alert>
                  : null
                }

                <Button className={classes.buttonCreate}
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Save Photo
              </Button>
                {formSubmitted === true && validForm === true && validPayment === true ?
                  <Redirect to="/ProfilePage" />
                  : null
                }
              </div>
              :
              <div>
               
                <p>Please setup Stripe in order to accept payments on Photogenix.</p>
               
                <Button className={classes.buttonCreate}
                  disabled
                  color="primary"
                  variant="contained"
                >
                  Save Photo
              </Button>
              </div>
            }

          </div>
          : null
        }


      </div>

    </div >
  );
}

export default PhotoCreationForm;
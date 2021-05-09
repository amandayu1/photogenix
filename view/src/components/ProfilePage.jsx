
import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import { PurchasesContainer } from "./CardContainer"
import { ReactComponent as LogoIcon } from "../assets/logo.svg";
import 'antd/dist/antd.css';
import { Button, CircularProgress, IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreditCardIcon from '@material-ui/icons/CreditCard';

const ProfilePage = () => {
  //deconstructs fields from the firestore user document that is given through context
  const { user, isStripeEnabled } = useContext(UserContext);
  const { photoURL, displayName, username } = user;
  const [loading, setLoading] = useState(false);

  const useStyles = makeStyles((theme) => ({
    LogOut: {
      color: theme.palette.primary.main,
      fontFamily: 'Assistant',
      fontSize: '1.25rem',
      display: 'inline-block',
      marginBottom: '30px',
      "&:hover": {
        color: '#55a19c',
      }
    },

    buttonCreate: {
      marginTop: '30px'
    },

    Title: {
      fontSize: "1.5rem",
      fontWeight: '600',
      textAlign: 'left',
      color: theme.palette.primary.main,
    },

    margin: {
      paddingLeft: '15px',
      marginTop: '40px',
      marginBottom: '30px',
      marginLeft: '15%',
      textAlign: 'left'
    },

    hello: {
      color: 'black'
    },

    photo: {
      background: `url(${photoURL || <LogoIcon />})  no-repeat center center`,
      backgroundSize: "cover",
      height: "4.5rem",
      width: "4.5rem",
      borderRadius: "100000px",
      float: 'left',
      marginRight: '10px',
      marginBottom: '20px'
    },

    Circle: {
      fontSize: '70px',
      float: 'right',
      textAlign: 'right',
      color: '#5060bb',
      marginRight: '30px',
    },

    LogOutWeb: {
      width: 210,
      color: 'rgb(75, 75, 75)',
      fontFamily: 'Assistant',
      fontSize: '1.25rem',
      margingTop: '35%',
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },

    vertIconMobile: {
      float: 'right',
      display: 'inline',
      margin: 0,
      padding: 0,
      paddingTop: 7,
      marginRight: 20,
    },

    vertIconWeb: {
      right: 50,
      position: 'absolute'

    },

    menuItem: {

      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },

    "@media screen and (min-width: 1000px)": {
      profileInfo: {
        float: 'left',
        width: '30%',
        position: 'paid'
      },
      margin: {
        marginLeft: '0%',
        textAlign: 'center'
      },
      EditIcon: {
        display: 'none',
      },
      photo: {
        background: `url(${photoURL || <LogoIcon />})  no-repeat center center`,
        backgroundSize: "cover",
        height: "150px",
        width: "150px",
        borderRadius: "100000px",
        marginLeft: 'auto',
        marginRight: '0px'
      },
      imgStyle: {
        width: "inherit",
        display: "inline-flex",
        flexDirection: "column",
        flexFlow: "column wrap",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginTop: "2em",
        fontFamily: "Assistant",
        borderRadius: "88px",
      },
      Title: {
        justifyContent: 'center',
        width: '100%',
        display: 'inline-flex',
        textAlign: 'center',
      },

      Bottom: {
        float: 'left',
        width: '30%',
        position: 'paid'
      },

      buttonCreate: {
        marginBottom: '20px'
      },

      vertIconMobile: {
        display: 'none'
      }

    },

    "@media screen and (max-width: 1000px)": {
      vertIconWeb: {
        display: 'none'
      }
    }

  }));

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function onStripeClick(event) {
    event.preventDefault();
    setLoading(true);
    window.location = 'https://dashboard.stripe.com/login';
    setLoading(false);
  }

  function handleStripeClick() {
    setLoading(true);
    var getStripeAccountLink = firebase.functions().httpsCallable('getStripeAccountLink')

    getStripeAccountLink({
      uid: auth.currentUser.uid,
    })
      .then((result) => {
        window.location = result.data.accountLinkURL;
        console.log(result)
        setLoading(false);
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <>
      <div className={classes.profileInfo}>
        <div className={classes.margin}>
          <div className={classes.imgStyle}>
            <div className={classes.photo}></div>
          </div>

          <div className={classes.Title}>
            <span className={classes.hello}> Hello,&nbsp;</span>
            <span>{displayName}!
              <IconButton
                className={classes.vertIconMobile}
                aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick} >
                <MoreVertIcon />
              </IconButton>
            </span>
          </div>

          <div>
            @{username}
          </div>

        </div>

        <div style={{ paddingTop: "1rem", }} className={classes.buttonCreate} >
          <Link to="/PhotoCreationForm" >
            <Button
              color="primary"
              variant="contained"
            >
              Add Photo
            </Button>
          </Link>
        </div>
      </div>

      <IconButton
        className={classes.vertIconWeb}
        aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick} >
        <MoreVertIcon />
      </IconButton>

      <Paper >
        <Menu anchorOrigin={{ horizontal: 'right', }} transformOrigin={{ horizontal: 'right', }}
          id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>

          <MenuItem className={classes.LogOutWeb} onClick={onStripeClick}>
            <ListItemIcon><CreditCardIcon /></ListItemIcon>
            {isStripeEnabled ?
              <Typography styles={classes.menuItem} >
                {loading ?
                  <CircularProgress size="1.25rem" color="white" />
                  :
                  <>
                    Stripe Dashboard
                    </>
                }
              </Typography>
              :
              <Typography styles={classes.menuItem} onClick={handleStripeClick}>
                {loading ?
                  <CircularProgress size="1rem" color="white" />
                  :
                  <>
                    Connect Stripe
                    </>
                }
              </Typography>
            }
          </MenuItem>

          <MenuItem className={classes.LogOutWeb} onClick={() => { auth.signOut() }} >
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <Typography >
              Log Out
          </Typography>
          </MenuItem>

        </Menu>
      </Paper>

      <PurchasesContainer
        uid={auth.currentUser.uid}
        ownerUserName={user.username}
      />

    </>
  )
};

export default ProfilePage;
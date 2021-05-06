import React, { useContext, useState} from "react";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import { BookingsContainer } from "./BookingsCardContainer"
import { ReactComponent as LogoIcon } from "../assets/LogoIcon.svg";
import 'antd/dist/antd.css';
import { Button,  IconButton, ListItemIcon, makeStyles, Menu, MenuItem, Paper, Typography } from '@material-ui/core';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const ProfilePage = () => {
  //deconstructs fields from the firestore user document that is given through context
  const { user } = useContext(UserContext);
  const { photoURL, displayName, username } = user;


  const useStyles = makeStyles((theme) => ({

    buttonCreate: {
      marginTop: '30px'
    },

    Title: {
      fontSize: "1.5rem",
      fontWeight: '600',
      textAlign: 'left',
      color: '#47817D',
    },

    margin: {
      paddingLeft: '15px',
      marginTop: '40px',
      marginBottom: '30px',
      marginLeft: '15%',
      textAlign: 'left'
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
      color: '#47817D',
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
        position: 'fixed'
      },
      margin: {
        marginLeft: '0%',
        textAlign: 'center'
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
        position: 'fixed'
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
        </div>

        <div >
         @{username}
        </div>
        

        <div className={classes.buttonCreate}>
          
            <Button
              color="primary"
              variant="contained"
            >
              Add Photo
            </Button>

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
         
          <MenuItem className={classes.LogOutWeb} onClick={() => { auth.signOut() }} >
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <Typography >
              Log Out
          </Typography>
          </MenuItem>

        </Menu>
      </Paper>

      <BookingsContainer
        uid={auth.currentUser.uid}
        ownerUserName={user.username}
      />

    </>
  )
};

export default ProfilePage;
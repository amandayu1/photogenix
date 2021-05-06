import React from "react";
import SellerView from "./Components/SellerView";
import UserProvider from "./providers/UserProvider";
import UserView from "./Components/UserView";

import "./App.css";
import {
  BrowserRouter as Router, Redirect, Route,
} from 'react-router-dom';
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core";

const photogenixTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#9AA4EC'
    },
    secondary: {
      main: '#f4a4a4'
    },
    checkboxCSS: {
      border: "1px solid red",
      fontSize: 40
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-size': '0.5rem',
      },
    },
  },
});

const useStyles = makeStyles({
  '@global': {
    '.MuiButton-root': {
      borderRadius: 100,
      textTransform: 'none'
    }
  }
});


function App() {
  useStyles();
  return (
    <ThemeProvider theme={photogenixTheme}>
      <UserProvider>

        <div className="App">
          <Router>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/SignIn" />}
            />
            <SellerView />
            <UserView />


          </Router>
        </div>

      </UserProvider>
    </ThemeProvider>
  );
}
export default App;
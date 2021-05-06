
import './App.css';
import React from "react";
import SellerView from "./Components/SellerView";
import UserView from "./Components/UserView";
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core";


const photogenixTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#47817d'
    },
    secondary: {
      main: '#d08b7f'
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
        </ThemeProvider>

  );
}
export default App;
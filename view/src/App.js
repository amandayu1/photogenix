
import './App.css';
import React from "react";
import SellerView from "./Components/SellerView";
import UserView from "./Components/UserView";

function App() {
  useStyles();
  return (
   
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

  );
}
export default App;
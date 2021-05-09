import React, { useContext } from "react";
import SignIn from "./SignIn";
import ProfilePage from "./ProfilePage";
import SignInLoading from "./SignInLoading";
import AccountSetup from "./AccountSetup";
import PhotoCreationForm from "./PhotoCreationForm";
import PhotoDetails from "./PhotoDetails";
import { UserContext } from "../providers/UserProvider";
import PrivateRoute from "../router/PrivateRoute";
import { Switch } from "react-router-dom";
import StripeReturnPage from "./StripeReturnPage";

//creates seller view based on if users are logged in or not
function SellerView() {
  const { user, /* updateContext, */ isStripeEnabled, initialized } = useContext(UserContext);

  //default is false in case non-logged in user attempts to access
  var isValidated = false;

  //updates isValidated to user's value if the user is logged in
  if (user) {
    console.log(user);
    isValidated = user.initialized;
    console.log("printing isValidated from sellerView");
    console.log(isValidated);
  }

  if (!initialized) {
    return (<PrivateRoute
      path="/SignInLoading"
      component={SignInLoading}
      isAuthenticated={!user}
      redirect={"/ProfilePage"}
      initialized={initialized}
    />);
  }

  //ROUTES ALL THE PAGES FOR THE SELLER FLOWS
  return (
    <Switch>
      <PrivateRoute
        exact
        path="/SignIn"
        component={SignIn}
        isAuthenticated={!user}
        redirect={"/ProfilePage"}
      />

      <PrivateRoute
        path="/PhotoCreationForm"
        component={PhotoCreationForm}
        isAuthenticated={user && isValidated}
        redirect={user ? "/AccountSetup" : "/SignIn"}
        isStripeEnabled={isStripeEnabled}
      />

      <PrivateRoute
        path="/SignInLoading"
        component={SignInLoading}
        isAuthenticated={!user}
        redirect={"/ProfilePage"}
        initialized={initialized}
      />

      <PrivateRoute
        exact
        path="/ProfilePage"
        component={ProfilePage}
        isAuthenticated={user && isValidated}
        redirect={user ? "/AccountSetup" : "/SignIn"}
      />
      <PrivateRoute
        exact
        path="/ProfilePage/photo=:id"
        component={PhotoDetails}
        isAuthenticated={user && isValidated}
      />
      <PrivateRoute
        path="/AccountSetup"
        component={AccountSetup}
        isAuthenticated={user && !isValidated}
        redirect={user ? "/ProfilePage" : "/SignIn"}
      />

      <PrivateRoute
        path="/ReturnToPhotogenix"
        component={StripeReturnPage}
        isAuthenticated={true}
        redirect="/SignIn"
      />

    </Switch>
  );
}
export default SellerView;

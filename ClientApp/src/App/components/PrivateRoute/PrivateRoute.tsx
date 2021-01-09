import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { FunctionComponent } from "react";
import { connect } from "react-redux";

import * as AuthenticationStore from "../../../store/AuthenticationStore";

export interface IPrivateRouteProps {
  component: any;
  path: string;
  exact?: boolean;
  isAuthenticated: boolean;
}

const PrivateRoute: FunctionComponent<IPrivateRouteProps> = ({
  component: Component,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated === true ? (
        <Redirect to="/auth/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default connect((state: AuthenticationStore.AuthenticationState) => ({
  isAuthenticated: state.isAuthenticated,
}))(PrivateRoute);

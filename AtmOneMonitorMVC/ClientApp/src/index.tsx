import "bootstrap/dist/css/bootstrap.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ToastProvider } from "react-toast-notifications";
import registerServiceWorker from "./registerServiceWorker";
import axios from "axios";

import setAuthToken from "./utils/setAuthToken";
import App from "./App/App";
import configureStore from "./store/configureStore";
import "./index.css";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href") as string;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore(history);

if (localStorage.nekotTwj) {
  setAuthToken(localStorage.nekotTwj);
  const decoded: any = jwtDecode(localStorage.nekotTwj);
  store.dispatch({ payload: decoded, type: "SET_CURRENT_USER" });
  (async function get() {
    const user = store.getState().auth?.user;
    try {
      store.dispatch({ type: "AUTH_LOADING", payload: true });
      const response = await axios.get("api/roles/privilegerights", {
        params: { roleId: user.RoleId },
      });

      if (response)
        store.dispatch({
          type: "GET_CURRENT_USER_ROLE_PRIVILEGES",
          payload: response.data,
        });
    } catch (error) {
      store.dispatch({ type: "AUTH_LOADING", payload: false });
    }
  })();

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    localStorage.removeItem("nekotTwj");
    const token = "";
    setAuthToken(token);
    store.dispatch({ type: "SET_CURRENT_USER", payload: {} });
    window.location.href = "/auth/login";
  }
} else {
  if (!window.location.href.includes("/auth/login")) {
    window.location.href = "/auth/login";
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ToastProvider placement="top-center" autoDismissTimeout={5000}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();

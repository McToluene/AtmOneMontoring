import { Reducer, Action } from "redux";
import { ILogin } from "../Dtos/Login";
import { AppThunkAction } from ".";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { isEmpty } from "../utils/isEmpty";
import { IUser } from "../types/IUser";
import { IRolePrivilege } from "../Dtos/IRole";
import { IAccessRight } from "../Dtos/IAccessRight";
import { GetErrors } from "./ErrorStore";

export interface AuthenticationState {
  isAuthenticated: boolean;
  loading: boolean;
  user: IUser;
  rolesPrivileges: IRolePrivilege[];
  rolePrivilege: IRolePrivilege;
  accessRight: IAccessRight;
  isRefreshFetch: boolean;
  denied: boolean;
}

interface GetCurrentUserAccessRight {
  type: "GET_CURRENT_USER_ACCESS_RIGHT";
  payload: IAccessRight;
}

interface GetCurrentUserRoleprivileges {
  type: "GET_CURRENT_USER_ROLE_PRIVILEGES";
  payload: IRolePrivilege[];
}

interface GetCurrentUserRoleprivilege {
  type: "GET_CURRENT_USER_ROLE_PRIVILEGE";
  payload: IRolePrivilege;
}

interface SetIsRefresToken {
  type: "SET_IS_REFRESH_TOKEN";
  payload: boolean;
}

interface SetCurrentUser {
  type: "SET_CURRENT_USER";
  payload: any;
}

interface AuthLoading {
  type: "AUTH_LOADING";
  payload: boolean;
}

interface SetPage {
  type: "SET_PAGE";
  payload: boolean;
}

type KnownAction =
  | SetCurrentUser
  | GetErrors
  | AuthLoading
  | SetIsRefresToken
  | GetCurrentUserAccessRight
  | GetCurrentUserRoleprivileges
  | GetCurrentUserRoleprivilege
  | SetPage;

const unloadedState: AuthenticationState = {
  isAuthenticated: false,
  loading: false,
  user: {} as IUser,
  rolesPrivileges: [],
  accessRight: {} as IAccessRight,
  rolePrivilege: {} as IRolePrivilege,
  denied: true,
  isRefreshFetch: false,
};

export const actionCreators = {
  loginUser: (loginData: ILogin): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "AUTH_LOADING", payload: true });
        const response = await axios.post("authentication/login", loginData);
        if (response) {
          const { token } = response?.data;
          localStorage.setItem("nekotTwj", token);
          setAuthToken(token);
          const decode: any = jwt_decode(token);
          dispatch({ payload: decode, type: "SET_CURRENT_USER" });
        }
      } catch (error) {
        dispatch({ type: "AUTH_LOADING", payload: false });
        dispatch({ payload: error.response?.data, type: "GET_ERRORS" });
      }
    })();
  },

  startCounter: function (user: any): AppThunkAction<KnownAction> {
    return () => {
      const expires = new Date(user?.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000;

      console.log("Timeout about to start");
      setTimeout(() => this.refreshToken(), timeout);
    };
  },

  refreshToken: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "AUTH_LOADING", payload: true });
        const response = await axios.post("authentication/refresh-token");
        console.log("RefreshToken");
        if (response) {
          const { token } = response?.data;
          localStorage.setItem("nekotTwj", token);
          setAuthToken(token);
          const decode: any = jwt_decode(token);
          dispatch({ payload: decode, type: "SET_CURRENT_USER" });
          dispatch({ payload: decode, type: "SET_IS_REFRESH_TOKEN" });
        }
      } catch (error) {
        dispatch({ payload: error.response?.data, type: "GET_ERRORS" });
        dispatch({ type: "AUTH_LOADING", payload: false });
      }
    })();
  },

  getRolePrivilegeRights: (roleId: number): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "AUTH_LOADING", payload: true });
        const response = await axios.get("api/roles/privilegerights", {
          params: { roleId },
        });

        if (response)
          dispatch({
            type: "GET_CURRENT_USER_ROLE_PRIVILEGES",
            payload: response?.data,
          });
      } catch (error) {
        dispatch({ type: "AUTH_LOADING", payload: false });
      }
    })();
  },

  getRolePrivilege: (url: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch({
      type: "GET_CURRENT_USER_ROLE_PRIVILEGE",
      payload: {} as IRolePrivilege,
    });
    const rolesPrivileges = getState().auth?.rolesPrivileges;
    if (rolesPrivileges) {
      let rolePrivilege = {} as IRolePrivilege;
      let isDenied = true;
      for (const _rolePrivilege of rolesPrivileges) {
        const rolePrivilegeUrl = _rolePrivilege.url;
        if (rolePrivilegeUrl !== null && url.toLowerCase().includes(rolePrivilegeUrl)) {
          rolePrivilege = _rolePrivilege;
          isDenied = false;
          break;
        }
      }
      dispatch({ type: "GET_CURRENT_USER_ROLE_PRIVILEGE", payload: rolePrivilege });
      dispatch({ type: "SET_PAGE", payload: isDenied });
    }
  },

  logout: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        localStorage.removeItem("nekotTwj");
        const emptyToken = "";
        setAuthToken(emptyToken);
        dispatch({ payload: {}, type: "SET_CURRENT_USER" });
        await axios.post("authentication/revoke-token", "");
      } catch (error) {
        dispatch({ payload: error.response?.data, type: "GET_ERRORS" });
      }
    })();
  },
};

export const reducer: Reducer<AuthenticationState> = (
  state: AuthenticationState | undefined,
  incomingAction: Action
): AuthenticationState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "AUTH_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "SET_CURRENT_USER":
      return {
        ...state,
        loading: false,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };

    case "GET_CURRENT_USER_ROLE_PRIVILEGE":
      return {
        ...state,
        loading: false,
        rolePrivilege: action.payload,
      };
    case "GET_CURRENT_USER_ROLE_PRIVILEGES":
      return {
        ...state,
        loading: false,
        rolesPrivileges: action.payload,
      };

    case "GET_CURRENT_USER_ACCESS_RIGHT":
      return {
        ...state,
        loading: false,
        accessRight: action.payload,
      };

    case "SET_PAGE":
      return {
        ...state,
        denied: action.payload,
      };

    case "SET_IS_REFRESH_TOKEN":
      return {
        ...state,
        isRefreshFetch: action.payload,
      };
    default:
      return state;
  }
};

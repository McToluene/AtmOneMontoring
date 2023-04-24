import axios from "axios";
import { Reducer, Action } from "redux";
import { AppThunkAction } from ".";

import { IUsers, IUser, ILDAPUser, IUserCreate } from "../Dtos/IUsers";
import { GetErrors } from "./ErrorStore";
import { ILdap } from "../Dtos/ILdap";
import { IResponse } from "../Dtos/IResponse";
import { ISearchADUsers } from "../Dtos/ITestConnecton";
import { IPagedResponse } from "../Dtos/IPagedResponse";
import { IITemValuePaginateFilter, IItemValueFilter } from "../Dtos/IItemValueFilter";
import { IPaginationFilter } from "../Dtos/IPaginationFilter";

export interface UsersState {
  users: IPagedResponse<IUsers> & IResponse<IUsers[]>;
  user: IResponse<IUser>;
  loading: boolean;
  response: boolean;
  updateResponse: IResponse<boolean>;
  ldap: ILdap;
  isConnected: boolean;
  isDownload: boolean;
  adUsers: IResponse<ILDAPUser[]>;
  isAdded: IResponse<boolean>;
}

interface GetUsers {
  type: "GET_USERS";
  payload: IPagedResponse<IUsers> & IResponse<IUsers[]>;
}

interface ClearUsers {
  type: "CLEAR_USERS";
  payload: IPagedResponse<IUsers> & IResponse<IUsers[]>;
}

interface GetLDAPUsers {
  type: "GET_LDAP_USERS";
  payload: IResponse<ILDAPUser[]>;
}

interface SetIsAdded {
  type: "SET_IS_ADDED";
  payload: IResponse<boolean>;
}

interface GetUser {
  type: "GET_USER";
  payload: IResponse<IUser>;
}

interface UserLoading {
  type: "USER_LOADING";
  payload: boolean;
}

interface SetResponse {
  type: "SET_RESPONSE";
  payload: boolean;
}

interface ClearResponse {
  type: "CLEAR_RESPONSE";
}

interface SetUpdateResponse {
  type: "SET_UPDATE_RESPONSE";
  payload: IResponse<boolean>;
}

interface ClearUpdateResponse {
  type: "CLEAR_UPDATE_RESPONSE";
}

interface TestConnection {
  type: "TEST_CONNECTION";
  payload: IResponse<boolean>;
}

interface SetDownload {
  type: "SET_DOWNLOAD";
  payload: boolean;
}

interface GetLdap {
  type: "GET_LDAP";
  payload: ILdap;
}

type KnownAction =
  | GetUsers
  | ClearUsers
  | GetErrors
  | GetUser
  | UserLoading
  | SetResponse
  | GetLDAPUsers
  | SetIsAdded
  | SetDownload
  | ClearResponse
  | ClearUpdateResponse
  | GetLdap
  | TestConnection
  | SetUpdateResponse;

const unloadedState: UsersState = {
  users: {} as IPagedResponse<IUsers> & IResponse<IUsers[]>,
  user: {} as IResponse<IUser>,
  loading: false,
  response: false,
  updateResponse: {} as IResponse<boolean>,
  ldap: {} as ILdap,
  isConnected: false,
  isDownload: false,
  adUsers: {} as IResponse<ILDAPUser[]>,
  isAdded: {} as IResponse<boolean>,
};

export const actionCreators = {
  getUsers: (): AppThunkAction<KnownAction> => (dispatch) => {
    const empty: any = [];
    dispatch({ type: "CLEAR_USERS", payload: empty });
    axios
      .get("api/users")
      .then((response) => dispatch({ type: "GET_USERS", payload: response.data }))
      .catch((error) => {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      });
  },

  export: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_DOWNLOAD", payload: true });
        const response = await axios.get("/api/users/export", {
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Users.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  getPaginatedUsers: (value: IPaginationFilter): AppThunkAction<KnownAction> => (dispatch) => {
    axios
      .get("api/users/paging", { params: { ...value } })
      .then((response) => dispatch({ type: "GET_USERS", payload: response.data }))
      .catch((error) => dispatch({ type: "GET_ERRORS", payload: error.response?.data }));
  },

  getUser: (id: number): AppThunkAction<KnownAction> => (dispatch) => {
    dispatch({ type: "USER_LOADING", payload: true });
    axios
      .get(`api/users/${id}`)
      .then((response) => dispatch({ type: "GET_USER", payload: response.data }))
      .catch((error) => {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      });
  },

  postApproved: (user: IUsers): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      dispatch({ type: "USER_LOADING", payload: true });
      try {
        const response = await axios.post(`api/users/approved`, user);
        if (response) dispatch({ type: "SET_RESPONSE", payload: response.data?.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error?.response?.data });
      }
    })();
  },

  postEdit: (user: IUser): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      dispatch({ type: "USER_LOADING", payload: true });
      try {
        const response = await axios.post("api/users/edit", user);
        if (response) dispatch({ type: "SET_UPDATE_RESPONSE", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error?.response?.data });
      }
    })();
  },

  getLdap: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "USER_LOADING", payload: true });
        const response = await axios.get("api/users/ldap");
        if (response) dispatch({ type: "GET_LDAP", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  testConnection: (testDetails: any): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "USER_LOADING", payload: true });
        const response = await axios.post("api/users/testconnection", testDetails);
        if (response) dispatch({ type: "TEST_CONNECTION", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error?.response?.data });
      }
    })();
  },

  loadADUser: (searchDetails: ISearchADUsers): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "USER_LOADING", payload: true });
        const response = await axios.get("/api/users/ldap/search", {
          params: { ...searchDetails },
        });

        if (response) dispatch({ type: "GET_LDAP_USERS", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  searchUsers: (userFilter: IItemValueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "USER_LOADING", payload: true });
        const response = await axios.get("/api/users/search", {
          params: { ...userFilter },
        });
        if (response) dispatch({ type: "GET_USERS", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  exportSearch: (userFilter: IItemValueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_DOWNLOAD", payload: true });
        const response = await axios.get("/api/users/search/export", {
          params: { ...userFilter },
          responseType: "blob",
        });

        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Users.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  searchPaginateUsers: (userFilter: IITemValuePaginateFilter): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "USER_LOADING", payload: true });
        const response = await axios.get("/api/users/paging/search", {
          params: { ...userFilter },
        });
        if (response) dispatch({ type: "GET_USERS", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  saveLdap: (ldap: any): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        await axios.post("/api/users/ldap", ldap);
      } catch (error) {
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  addAdUser: (users: IUserCreate[]): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "USER_LOADING", payload: true });
        const response = await axios.post("/api/users", users);
        if (response) dispatch({ type: "SET_IS_ADDED", payload: response.data });
      } catch (error) {
        dispatch({ type: "USER_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },
};

export const reducer: Reducer<UsersState> = (
  state: UsersState | undefined,
  incomingAction: Action
): UsersState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_USERS":
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case "CLEAR_USERS":
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case "GET_LDAP_USERS":
      return {
        ...state,
        loading: false,
        adUsers: action.payload,
      };

    case "SET_IS_ADDED":
      return {
        ...state,
        loading: false,
        isAdded: action.payload,
      };

    case "GET_USER":
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case "SET_RESPONSE":
      return {
        ...state,
        loading: false,
        response: action.payload,
      };

    case "CLEAR_RESPONSE":
      return {
        ...state,
        response: false,
      };

    case "SET_UPDATE_RESPONSE":
      return {
        ...state,
        loading: false,
        updateResponse: action.payload,
      };

    case "CLEAR_UPDATE_RESPONSE":
      return {
        ...state,
        updateResponse: {} as IResponse<boolean>,
      };

    case "USER_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "GET_LDAP":
      return {
        ...state,
        loading: false,
        ldap: action.payload,
      };

    case "TEST_CONNECTION":
      return {
        ...state,
        loading: false,
        isConnected: action.payload.data,
      };

    case "SET_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };

    default:
      return state;
  }
};

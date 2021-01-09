import { Reducer, Action } from "redux";
import { AppThunkAction } from ".";
import axios from "axios";

import { IRolePrivileges, IPrivileges } from "../Dtos/IRole";
import { GetErrors } from "./ErrorStore";
import { IAccessRight } from "../Dtos/IAccessRight";

export interface RoleState {
  rolesPrivileges: IRolePrivileges[];
  privileges: IPrivileges[];
  responseAdd: boolean;
  reponseAddRemove: boolean;
  loading: boolean;
  accessRight: IAccessRight[];
  unAuthorizedPage: boolean;
  updateResponse: boolean;
  isDownload: boolean;
}

interface GetRoles {
  type: "GET_ROLES";
  payload: IRolePrivileges[];
}

interface GetPrivileges {
  type: "GET_PRIVILEGES";
  payload: IPrivileges[];
}

interface AddRolePrivilege {
  type: "ADD_ROLE_PRIVILEGE";
  payload: boolean;
}

interface AddRolePrivileges {
  type: "ADD_ROLE_PRIVILEGES";
  payload: boolean;
}

interface SetRoleLoading {
  type: "SET_ROLE_LOADING";
  payload: boolean;
}

interface GetAccessRight {
  type: "GET_ACCESS_RIGHT";
  payload: IAccessRight[];
}

interface SetUpdated {
  type: "SET_UPDATED";
  payload: boolean;
}

interface SetRolePage {
  type: "SET_ROLE_PAGE";
  payload: boolean;
}

interface SetDownload {
  type: "SET_DOWNLOAD";
  payload: boolean;
}

type KnownAction =
  | GetRoles
  | GetPrivileges
  | AddRolePrivileges
  | AddRolePrivilege
  | SetRolePage
  | SetRoleLoading
  | SetDownload
  | SetUpdated
  | GetErrors
  | GetAccessRight;

const unloadedState: RoleState = {
  rolesPrivileges: [],
  privileges: [],
  responseAdd: false,
  reponseAddRemove: false,
  loading: false,
  accessRight: [],
  isDownload: false,
  unAuthorizedPage: false,
  updateResponse: false,
};

export const actionCreators = {
  getRoles: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function fetch() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.get("api/roles");
        if (response) dispatch({ type: "GET_ROLES", payload: response.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPrivileges: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function fetch() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.get("api/roles/privileges");
        if (response) dispatch({ type: "GET_PRIVILEGES", payload: response.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addRemoveRolePrivileges: (value: {
    removedPrivileges: IPrivileges[];
    rolePrivileges: IPrivileges[];
  }): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.put("api/roles", value);
        if (response) dispatch({ type: "ADD_ROLE_PRIVILEGES", payload: response?.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error?.response?.data });
      }
    })();
  },

  addRolePrivilege: (value: {
    roleId: number;
    privilegeId: number;
  }): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.post("api/roles/privileges", value);
        if (response) dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: response.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  updateRolePrivilege: (value: {
    roleId: number;
    privilegeId: number;
    prevPrivilegeId: number;
  }): AppThunkAction<KnownAction> => (dispatch) => {
    (async function put() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.put("api/roles/privileges", value);
        if (response) dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: response.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error?.response?.data });
      }
    })();
  },

  deleteRolePrivlege: (value: {
    roleId: number;
    privilegeId: number;
  }): AppThunkAction<KnownAction> => (dispatch) => {
    (async () => {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.delete("api/roles/privileges", { params: { ...value } });
        if (response) dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: response.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error?.response?.data });
      }
    })();
  },

  getAccessRights: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function fetch() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.get("api/roles/accessrights");
        if (response) dispatch({ type: "GET_ACCESS_RIGHT", payload: response.data });
        else dispatch({ type: "GET_ERRORS", payload: "Request Failed" });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  updateAccessRights: (value: IAccessRight[]): AppThunkAction<KnownAction> => (dispatch) => {
    (async function put() {
      try {
        dispatch({ type: "SET_ROLE_LOADING", payload: true });
        const response = await axios.put("api/roles/accessrights", value);
        if (response) dispatch({ type: "SET_UPDATED", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ROLE_LOADING", payload: false });
        if (error.response?.headers?.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ROLE_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  export: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_DOWNLOAD", payload: true });
        const response = await axios.get("", { responseType: "blob" });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "AccessRight.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_DOWNLOAD", payload: false });
        }
        dispatch({ type: "SET_DOWNLOAD", payload: false });
      } catch (error) {
        dispatch({ type: "SET_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<RoleState> = (
  state: RoleState | undefined,
  incomingAction: Action
): RoleState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_ROLES":
      return {
        ...state,
        loading: false,
        rolesPrivileges: action.payload,
      };
    case "GET_PRIVILEGES":
      return {
        ...state,
        loading: false,
        privileges: action.payload,
      };
    case "ADD_ROLE_PRIVILEGE":
      return {
        ...state,
        loading: false,
        responseAdd: action.payload,
      };
    case "ADD_ROLE_PRIVILEGES":
      return {
        ...state,
        loading: false,
        reponseAddRemove: action.payload,
      };
    case "SET_ROLE_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_ACCESS_RIGHT":
      return {
        ...state,
        loading: false,
        accessRight: action.payload,
      };
    case "SET_ROLE_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_UPDATED":
      return {
        ...state,
        loading: false,
        updateResponse: action.payload,
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

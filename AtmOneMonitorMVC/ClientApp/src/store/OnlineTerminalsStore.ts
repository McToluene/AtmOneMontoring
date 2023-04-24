import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import axios from "axios";

import { IResponse } from "../Dtos/IResponse";
import { IOnlineTerminal, OnlineStats } from "../Dtos/ITerminal";
import { IPagedResponse } from "../Dtos/IPagedResponse";
import {
  IDateItemValuePaginateFilter,
  IDateItemValueFilter,
} from "../Dtos/IDateItemValueFilter";
import { GetErrors } from "./ErrorStore";
import { ILicenseInfo } from "../Dtos/ILicenseInfo";

export interface OnlineTerminalState {
  loading: boolean;
  onlineTerminals: IPagedResponse<IOnlineTerminal> &
    IResponse<IOnlineTerminal[]>;
  unAuthorizedPage: boolean;
  isDownload: boolean;
  licenseInfo: IResponse<ILicenseInfo>;
  isAdded: IResponse<boolean>;
  online: IResponse<OnlineStats>;
}

interface GetTerminals {
  type: "GET_ONLINE_TERMINALS";
  payload: IPagedResponse<IOnlineTerminal> & IResponse<IOnlineTerminal[]>;
}

interface SetLoading {
  type: "SET_ONLINE_TERMINALS_LOADING";
  payload: boolean;
}

interface SetUnAuthorizedPage {
  type: "SET_ONLINE_TERMINALS_PAGE";
  payload: boolean;
}

interface SetDownload {
  type: "SET_ONLINE_TERMINALS_DOWNLOAD";
  payload: boolean;
}

interface SetLicenseInfo {
  type: "SET_LICENSE_INFO";
  payload: IResponse<ILicenseInfo>;
}

interface SetIsAdded {
  type: "SET_IS_ADDED";
  payload: IResponse<boolean>;
}

interface GetOnlineTerminalsStats {
  type: "GET_ONLINE_TERMINALS_STATS";
  payload: IResponse<OnlineStats>;
}

type KnownAction =
  | GetTerminals
  | SetLoading
  | SetUnAuthorizedPage
  | GetOnlineTerminalsStats
  | SetDownload
  | SetLicenseInfo
  | SetIsAdded
  | GetErrors;

const unloadedState: OnlineTerminalState = {
  isDownload: false,
  loading: false,
  onlineTerminals: {} as IPagedResponse<IOnlineTerminal> &
    IResponse<IOnlineTerminal[]>,
  unAuthorizedPage: false,
  licenseInfo: {} as IResponse<ILicenseInfo>,
  isAdded: {} as IResponse<boolean>,
  online: {} as IResponse<OnlineStats>,
};

export const actionCreators = {
  getOnlineTerminals: (
    filter: IDateItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: true });
        const response = await axios.get("/api/onlineterminals", {
          params: { ...filter },
        });

        if (response)
          dispatch({ type: "GET_ONLINE_TERMINALS", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPaginatedonlineTerminals: (
    filter: IDateItemValuePaginateFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: true });
        const response = await axios.get("/api/onlineterminals/paging", {
          params: { ...filter },
        });

        if (response)
          dispatch({ type: "GET_ONLINE_TERMINALS", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  export: (
    terminalFilter: IDateItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_ONLINE_TERMINALS_DOWNLOAD", payload: true });
        const response = await axios.get("/api/onlineterminals/export", {
          params: { ...terminalFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "OnlineTerminals.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_ONLINE_TERMINALS_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_ONLINE_TERMINALS_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getLicenseInfo: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: true });
        const response = await axios.get("/api/license");
        if (response)
          dispatch({ type: "SET_LICENSE_INFO", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addLicense: (license: string): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: true });
        const response = await axios.post("/api/license", license);
        if (response)
          dispatch({ type: "SET_IS_ADDED", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getOnlineTerminalsStats: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: true });
        const response = await axios.get("/api/onlineterminals/online");
        if (response)
          dispatch({
            type: "GET_ONLINE_TERMINALS_STATS",
            payload: response.data,
          });
      } catch (error) {
        dispatch({ type: "SET_ONLINE_TERMINALS_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_ONLINE_TERMINALS_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<OnlineTerminalState> = (
  state: OnlineTerminalState | undefined,
  incomingAction: Action
): OnlineTerminalState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "GET_ONLINE_TERMINALS":
      return {
        ...state,
        loading: false,
        onlineTerminals: action.payload,
      };
    case "GET_ONLINE_TERMINALS_STATS":
      return {
        ...state,
        loading: false,
        online: action.payload,
      };

    case "SET_ONLINE_TERMINALS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ONLINE_TERMINALS_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_ONLINE_TERMINALS_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    case "SET_LICENSE_INFO":
      return {
        ...state,
        loading: false,
        licenseInfo: action.payload,
      };
    case "SET_IS_ADDED":
      return {
        ...state,
        loading: false,
        isAdded: action.payload,
      };
    default:
      return state;
  }
};

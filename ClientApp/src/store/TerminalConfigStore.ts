import axios from "axios";
import { Action, Reducer } from "redux";

import { IPagedResponse } from "../Dtos/IPagedResponse";
import {
  ITerminalConfig,
  ITerminalConfiguration,
  ITerminalVendor,
  ITerminalConfigurationCreate,
  IApproveTerminal,
  ITerminalConfigApproval,
} from "../Dtos/ITerminal";
import { IResponse } from "../Dtos/IResponse";
import { GetErrors, ClearErrors } from "./ErrorStore";
import { AppThunkAction } from ".";
import {
  IItemValueFilter,
  IITemValuePaginateFilter,
} from "../Dtos/IItemValueFilter";

export interface TerminalConfigState {
  terminalConfigs: IPagedResponse<ITerminalConfig> &
    IResponse<ITerminalConfig[]>;
  terminalConfig: IResponse<ITerminalConfiguration>;
  isAdded: IResponse<boolean>;
  unAuthorizedPage: boolean;
  loading: boolean;
  isDownload: boolean;
  terminals: IResponse<ITerminalVendor[]>;
  configApproval: IResponse<IApproveTerminal>;
  isConfigApprove: IResponse<boolean>;
  terminalConfigsApproval: IPagedResponse<ITerminalConfigApproval> &
    IResponse<ITerminalConfigApproval[]>;
}

interface GetTerminalConfigs {
  type: "GET_TERMINAL_CONFIGS";
  payload: IPagedResponse<ITerminalConfig> & IResponse<ITerminalConfig[]>;
}

interface GetTerminalConfig {
  type: "GET_TERMINAL_CONFIG";
  payload: IResponse<ITerminalConfiguration>;
}

interface GetConfigApproval {
  type: "GET_CONFIG_APPROVAL";
  payload: IResponse<IApproveTerminal>;
}

interface SetLoading {
  type: "SET_TERMINAL_CONFIG_LOADING";
  payload: boolean;
}

interface SetUnAuthorizedPage {
  type: "SET_TERMINAL_CONFIG_PAGE";
  payload: boolean;
}

interface SetIsCreated {
  type: "SET_IS_TERMINAL_CREATED";
  payload: IResponse<boolean>;
}

interface SetDownload {
  type: "SET_TERMINAL_CONFIG_DOWNLOAD";
  payload: boolean;
}

interface SetIsApprove {
  type: "SET_IS_APPROVE";
  payload: IResponse<boolean>;
}

interface GetTerminalVendor {
  type: "GET_TERMINAL_VENDOR";
  payload: IResponse<ITerminalVendor[]>;
}

interface GetTerminalConfigApproval {
  type: "GET_TERMINAL_CONFIGS_APPROVAL";
  payload: IPagedResponse<ITerminalConfigApproval> &
    IResponse<ITerminalConfigApproval[]>;
}

type KnownAction =
  | GetTerminalConfig
  | GetTerminalConfigs
  | GetTerminalConfigApproval
  | SetDownload
  | SetLoading
  | SetUnAuthorizedPage
  | SetIsCreated
  | SetIsApprove
  | GetTerminalVendor
  | GetConfigApproval
  | GetErrors
  | ClearErrors;

const unloadedState: TerminalConfigState = {
  isAdded: {} as IResponse<boolean>,
  loading: false,
  unAuthorizedPage: false,
  terminalConfig: {} as IResponse<ITerminalConfiguration>,
  terminalConfigs: {} as IPagedResponse<ITerminalConfig> &
    IResponse<ITerminalConfig[]>,
  isDownload: false,
  terminals: {} as IResponse<ITerminalVendor[]>,
  configApproval: {} as IResponse<IApproveTerminal>,
  isConfigApprove: {} as IResponse<boolean>,
  terminalConfigsApproval: {} as IPagedResponse<ITerminalConfigApproval> &
    IResponse<ITerminalConfigApproval[]>,
};

export const actionCreators = {
  getTerminalByVendor: (vendorId: number): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: false });
        const response = await axios.get("api/terminals/vendor", {
          params: { vendorId },
        });
        if (response)
          dispatch({ type: "GET_TERMINAL_VENDOR", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addTerminalConfig: (
    terminal: ITerminalConfigurationCreate
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: true });
        const response = await axios.post("api/terminalconfig", terminal);
        if (response)
          dispatch({ type: "SET_IS_TERMINAL_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getTerminalConfigs: (
    terminalConfigFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_CONFIG_LOADING" });
        const response = await axios.get("api/terminalconfig", {
          params: { ...terminalConfigFilter },
        });
        if (response)
          dispatch({ type: "GET_TERMINAL_CONFIGS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getTerminalConfigsApproval: (
    terminalConfigFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_CONFIG_LOADING" });
        const response = await axios.get("api/terminalconfig/approval", {
          params: { ...terminalConfigFilter },
        });
        if (response)
          dispatch({
            type: "GET_TERMINAL_CONFIGS_APPROVAL",
            payload: response.data,
          });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPaginatedTerminalConfigs: (
    terminalConfigFilter: IITemValuePaginateFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_CONFIG_LOADING" });
        const response = await axios.get("api/terminalconfig/paging", {
          params: { ...terminalConfigFilter },
        });
        if (response)
          dispatch({ type: "GET_TERMINAL_CONFIGS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPaginatedTerminalConfigsApproval: (
    terminalConfigFilter: IITemValuePaginateFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_CONFIG_LOADING" });
        const response = await axios.get("api/terminalconfig/approval/paging", {
          params: { ...terminalConfigFilter },
        });
        if (response)
          dispatch({
            type: "GET_TERMINAL_CONFIGS_APPROVAL",
            payload: response.data,
          });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getTerminalConfig: (id: number): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: true });
        const response = await axios.get("api/terminalconfig/detail", {
          params: { id },
        });

        if (response)
          dispatch({ type: "GET_TERMINAL_CONFIG", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getConfig: (id: number): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: true });
        const response = await axios.get("api/terminalconfig/approval-detail", {
          params: { id },
        });

        if (response)
          dispatch({ type: "GET_CONFIG_APPROVAL", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  approveConfig: (value: {
    configId: number;
    terminalId: string;
  }): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: true });
        const response = await axios.post("api/terminalconfig/approve", value);

        if (response)
          dispatch({ type: "SET_IS_APPROVE", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  exportTerminalConfig: (
    terminalFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_DOWNLOAD", payload: true });
        const response = await axios.get("/api/terminalconfig/export", {
          params: { ...terminalFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "ATMConfiguration.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_TERMINAL_CONFIG_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  exportApproveTerminalConfig: (
    terminalFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_TERMINAL_CONFIG_DOWNLOAD", payload: true });
        const response = await axios.get(
          "/api/terminalconfig/approval/export",
          {
            params: { ...terminalFilter },
            responseType: "blob",
          }
        );
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "ATMConfigurationApproval.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_TERMINAL_CONFIG_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_TERMINAL_CONFIG_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<TerminalConfigState> = (
  state: TerminalConfigState | undefined,
  incomingAction: Action
): TerminalConfigState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "SET_TERMINAL_CONFIG_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_TERMINAL_CONFIGS":
      return {
        ...state,
        loading: false,
        terminalConfigs: action.payload,
      };
    case "GET_TERMINAL_CONFIG":
      return {
        ...state,
        loading: false,
        terminalConfig: action.payload,
      };
    case "SET_TERMINAL_CONFIG_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_IS_TERMINAL_CREATED":
      return {
        ...state,
        loading: false,
        isAdded: action.payload,
      };
    case "SET_TERMINAL_CONFIG_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    case "GET_TERMINAL_VENDOR":
      return {
        ...state,
        loading: false,
        terminals: action.payload,
      };
    case "GET_CONFIG_APPROVAL":
      return {
        ...state,
        loading: false,
        configApproval: action.payload,
      };
    case "SET_IS_APPROVE":
      return {
        ...state,
        loading: false,
        isConfigApprove: action.payload,
      };
    case "GET_TERMINAL_CONFIGS_APPROVAL":
      return {
        ...state,
        loading: false,
        terminalConfigsApproval: action.payload,
      };
    default:
      return state;
  }
};

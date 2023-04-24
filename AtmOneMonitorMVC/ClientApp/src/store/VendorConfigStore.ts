import { Reducer, Action } from "redux";
import axios from "axios";

import { IPagedResponse } from "../Dtos/IPagedResponse";
import { IResponse } from "../Dtos/IResponse";
import { IVendorConfig, IVendorConfiguration } from "../Dtos/IVendor";
import { GetErrors, ClearErrors } from "./ErrorStore";
import { AppThunkAction } from ".";
import {
  IItemValueFilter,
  IITemValuePaginateFilter,
} from "../Dtos/IItemValueFilter";

export interface VendorConfigState {
  vendorConfigs: IPagedResponse<IVendorConfig> & IResponse<IVendorConfig[]>;
  vendorConfig: IResponse<IVendorConfiguration>;
  isAdded: IResponse<boolean>;
  unAuthorizedPage: boolean;
  loading: boolean;
  isDownload: boolean;
}

interface GetVendorConfigs {
  type: "GET_VENDOR_CONFIGS";
  payload: IPagedResponse<IVendorConfig> & IResponse<IVendorConfig[]>;
}

interface GetVendorConfig {
  type: "GET_VENDOR_CONFIG";
  payload: IResponse<IVendorConfiguration>;
}

interface SetLoading {
  type: "SET_VENDOR_CONFIG_LOADING";
  payload: boolean;
}

interface SetUnAuthorizedPage {
  type: "SET_VENDOR_CONFIG_PAGE";
  payload: boolean;
}

interface SetIsCreated {
  type: "SET_IS_CREATED";
  payload: IResponse<boolean>;
}

interface SetDownload {
  type: "SET_VENDOR_CONFIG_DOWNLOAD";
  payload: boolean;
}

type KnownAction =
  | GetVendorConfig
  | GetVendorConfigs
  | SetLoading
  | SetUnAuthorizedPage
  | SetIsCreated
  | SetDownload
  | GetErrors
  | ClearErrors;

const unloadedState: VendorConfigState = {
  isAdded: {} as IResponse<boolean>,
  loading: false,
  unAuthorizedPage: false,
  vendorConfig: {} as IResponse<IVendorConfiguration>,
  vendorConfigs: {} as IPagedResponse<IVendorConfig> &
    IResponse<IVendorConfig[]>,
  isDownload: false,
};

export const actionCreators = {
  addVendorConfig: (
    vendorConfig: IVendorConfiguration
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_VENDOR_CONFIG_LOADING", payload: true });
        const response = await axios.post("api/vendorconfig", vendorConfig);
        if (response)
          dispatch({ type: "SET_IS_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_VENDOR_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getVendorConfigs: (
    vendorConfigFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_VENDOR_CONFIG_LOADING" });
        const response = await axios.get("api/vendorconfig", {
          params: { ...vendorConfigFilter },
        });
        if (response)
          dispatch({ type: "GET_VENDOR_CONFIGS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_VENDOR_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_VENDOR_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPaginatedVendorConfigs: (
    vendorConfigFilter: IITemValuePaginateFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_VENDOR_CONFIG_LOADING" });
        const response = await axios.get("api/vendorconfig/paging", {
          params: { ...vendorConfigFilter },
        });
        if (response)
          dispatch({ type: "GET_VENDOR_CONFIGS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_VENDOR_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_VENDOR_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getVendorConfig: (id: number): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_VENDOR_CONFIG_LOADING", payload: true });
        const response = await axios.get("api/vendorconfig/detail", {
          params: { id },
        });

        if (response)
          dispatch({ type: "GET_VENDOR_CONFIG", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_VENDOR_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  updateVendorConfig: (
    vendorConfig: IVendorConfiguration
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function put() {
      try {
        dispatch({ payload: true, type: "SET_VENDOR_CONFIG_LOADING" });
        const response = await axios.put("api/vendorconfig", vendorConfig);
        if (response)
          dispatch({ type: "SET_IS_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_VENDOR_CONFIG_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_VENDOR_CONFIG_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_VENDOR_CONFIG_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  export: (
    vendorConfigFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_VENDOR_CONFIG_DOWNLOAD", payload: true });
        const response = await axios.get("/api/vendorconfig/export", {
          params: { ...vendorConfigFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "VendorConfiguration.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_VENDOR_CONFIG_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_VENDOR_CONFIG_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<VendorConfigState> = (
  state: VendorConfigState | undefined,
  incomingAction: Action
): VendorConfigState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "SET_VENDOR_CONFIG_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_VENDOR_CONFIGS":
      return {
        ...state,
        loading: false,
        vendorConfigs: action.payload,
      };
    case "GET_VENDOR_CONFIG":
      return {
        ...state,
        loading: false,
        vendorConfig: action.payload,
      };
    case "SET_VENDOR_CONFIG_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_IS_CREATED":
      return {
        ...state,
        loading: false,
        isAdded: action.payload,
      };
    case "SET_VENDOR_CONFIG_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    default:
      return state;
  }
};

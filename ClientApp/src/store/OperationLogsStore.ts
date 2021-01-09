import { Reducer, Action } from "redux";
import { AppThunkAction } from ".";
import axios from "axios";

import { IPagedResponse } from "../Dtos/IPagedResponse";
import { IOperationLog } from "../Dtos/IOperationLog";
import { IResponse } from "../Dtos/IResponse";
import { GetErrors, ClearErrors } from "./ErrorStore";
import { IPaginationFilter } from "../Dtos/IPaginationFilter";
import { IItemValueFilter } from "../Dtos/IItemValueFilter";

export interface OperationLogsState {
  loading: boolean;
  unAuthorizedPage: boolean;
  operationLogs: IPagedResponse<IOperationLog> & IResponse<IOperationLog[]>;
  isDownload: boolean;
}

interface SetLoading {
  type: "SET_LOGS_LOADING";
  payload: boolean;
}

interface GetOperationLogs {
  type: "GET_OPERATION_LOGS";
  payload: IPagedResponse<IOperationLog> & IResponse<IOperationLog[]>;
}

interface ClearOperationLogs {
  type: "CLEAR_OPERATION_LOGS";
  payload: IPagedResponse<IOperationLog> & IResponse<IOperationLog[]>;
}

interface SetUnAuthorizedPage {
  type: "SET_ACCESS_LOG_PAGE";
  payload: boolean;
}

interface SetDownload {
  type: "SET_LOGS_DOWNLOAD";
  payload: boolean;
}

type KnownAction =
  | SetLoading
  | GetOperationLogs
  | SetDownload
  | SetUnAuthorizedPage
  | ClearOperationLogs
  | GetErrors
  | ClearErrors;

const unloadedState: OperationLogsState = {
  loading: false,
  unAuthorizedPage: false,
  operationLogs: {} as IPagedResponse<IOperationLog> & IResponse<IOperationLog[]>,
  isDownload: false,
};

export const actionCreators = {
  getOperatonLogsPaging: (filter: IPaginationFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_LOGS_LOADING" });
        const response = await axios.get("/api/operationlogs/paging", {
          params: { ...filter },
        });

        if (response) dispatch({ type: "GET_OPERATION_LOGS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_LOGS_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ACCESS_LOG_PAGE",
          });
        }
        dispatch({ payload: error.response.data, type: "GET_ERRORS" });
      }
    })();
  },

  getOperatonLogs: (filter: IItemValueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_LOGS_LOADING" });
        const response = await axios.get("/api/operationlogs", {
          params: { ...filter },
        });

        if (response) dispatch({ type: "GET_OPERATION_LOGS", payload: response?.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_LOGS_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ACCESS_LOG_PAGE",
          });
        }
        dispatch({ payload: error?.response?.data, type: "GET_ERRORS" });
      }
    })();
  },

  searchOperationLogsPaging: (
    item: string,
    value: string,
    filter: IPaginationFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_LOGS_LOADING" });
        const response = await axios.get("/api/operationlogs/paging/search", {
          params: { item, value, ...filter },
        });

        if (response) dispatch({ type: "GET_OPERATION_LOGS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_LOGS_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_ACCESS_LOG_PAGE",
          });
        }
        dispatch({ payload: error.response.data, type: "GET_ERRORS" });
      }
    })();
  },

  export: (itemValue: IItemValueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_LOGS_DOWNLOAD", payload: true });
        const response = await axios.get("/api/operationlogs/export", {
          params: { ...itemValue },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "OperationLogs.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_LOGS_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_LOGS_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<OperationLogsState> = (
  state: OperationLogsState | undefined,
  incomingAction: Action
): OperationLogsState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_OPERATION_LOGS":
      return {
        ...state,
        loading: false,
        operationLogs: action.payload,
      };
    case "SET_LOGS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ACCESS_LOG_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_LOGS_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    default:
      return state;
  }
};

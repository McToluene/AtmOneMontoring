import axios from "axios";
import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";

import { ITerminal, ITerminalCreate } from "../Dtos/ITerminal";
import { GetErrors } from "./ErrorStore";
import { IResponse } from "../Dtos/IResponse";
import { IPagedResponse } from "../Dtos/IPagedResponse";
import {
  IITemValuePaginateFilter,
  IItemValueFilter,
} from "../Dtos/IItemValueFilter";

export interface TerminalState {
  terminals: IPagedResponse<ITerminal> & IResponse<ITerminal[]>;
  loading: boolean;
  unAuthorizedPage: boolean;
  isCreated: IResponse<boolean>;
  terminal: IResponse<ITerminalCreate>;
  isDownload: boolean;
}

interface GetTerminals {
  type: "GET_TERMINALS";
  payload: IPagedResponse<ITerminal> & IResponse<ITerminal[]>;
}

interface SetLoading {
  type: "SET_TERMINAL_LOADING";
  payload: boolean;
}

interface SetUnAuthorizedPage {
  type: "SET_TERMINAL_PAGE";
  payload: boolean;
}

interface SetIsTerminalCreated {
  type: "SET_IS_TERMINAL_CREATED";
  payload: IResponse<boolean>;
}

interface GetTerminal {
  type: "GET_TERMINAL";
  payload: IResponse<ITerminalCreate>;
}

interface SetDownload {
  type: "SET_TERMINALS_DOWNLOAD";
  payload: boolean;
}

type KnownAction =
  | GetTerminals
  | GetTerminal
  | SetUnAuthorizedPage
  | SetIsTerminalCreated
  | SetDownload
  | SetLoading
  | GetErrors;

const unloadedState: TerminalState = {
  loading: false,
  terminals: {} as IPagedResponse<ITerminal> & IResponse<ITerminal[]>,
  unAuthorizedPage: false,
  isCreated: {} as IResponse<false>,
  terminal: {} as IResponse<ITerminalCreate>,
  isDownload: false,
};

export const actionCreators = {
  getTerminals: (
    terminalFilter: IItemValueFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_LOADING" });
        const response = await axios.get("api/terminals", {
          params: { ...terminalFilter },
        });
        if (response)
          dispatch({ type: "GET_TERMINALS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addTerminal: (terminal: ITerminalCreate): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function post() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_LOADING" });
        const response = await axios.post("api/terminals", terminal);
        if (response)
          dispatch({ type: "SET_IS_TERMINAL_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addTerminals: (terminals: ITerminalCreate[]): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function post() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_LOADING" });
        const response = await axios.post("api/terminals/list", terminals);
        if (response)
          dispatch({ type: "SET_IS_TERMINAL_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPaginatedTerminals: (
    terminalFilter: IITemValuePaginateFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_LOADING" });
        const response = await axios.get("api/terminals/paging", {
          params: { ...terminalFilter },
        });
        if (response)
          dispatch({ type: "GET_TERMINALS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getTerminalDetail: (id: string): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_LOADING" });
        const response = await axios.get("api/terminals/detail", {
          params: { id },
        });
        if (response)
          dispatch({ type: "GET_TERMINAL", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  updateTerminal: (terminal: ITerminalCreate): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function put() {
      try {
        dispatch({ payload: true, type: "SET_TERMINAL_LOADING" });
        const response = await axios.put("api/terminals", terminal);
        if (response)
          dispatch({ type: "SET_IS_TERMINAL_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_TERMINAL_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_TERMINAL_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  export: (terminalFilter: IItemValueFilter): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "SET_TERMINALS_DOWNLOAD", payload: true });
        const response = await axios.get("/api/terminals/export", {
          params: { ...terminalFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Terminals.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_TERMINALS_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_TERMINALS_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<TerminalState> = (
  state: TerminalState | undefined,
  incomingAction: Action
): TerminalState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "GET_TERMINALS":
      return {
        ...state,
        loading: false,
        terminals: action.payload,
      };
    case "SET_TERMINAL_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_TERMINAL_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_IS_TERMINAL_CREATED":
      return {
        ...state,
        loading: false,
        isCreated: action.payload,
      };
    case "GET_TERMINAL":
      return {
        ...state,
        loading: false,
        terminal: action.payload,
      };
    case "SET_TERMINALS_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    default:
      return state;
  }
};

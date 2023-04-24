import { Action, Reducer } from "redux";
import { AppThunkAction } from ".";
import axios from "axios";

import IIssue from "../Dtos/IIssue";
import { GetErrors } from "./ErrorStore";
import { IResponse } from "../Dtos/IResponse";
import { IPagedResponse } from "../Dtos/IPagedResponse";
import {
  IIssueFilter,
  IIssuePagingFilter,
  ISelectedIIssueFilter,
  ISelectedIIssuePagingFilter,
} from "../Dtos/IIssueFilter";

export interface DetailsState {
  issues: IResponse<IIssue[]>;
  loading: boolean;
  isDownload: boolean;
}

interface GetIssues {
  type: "GET_ISSUES";
  payload: IResponse<IIssue[]>;
}

interface ClearIssues {
  type: "CLEAR_ISSUES";
  payload: IResponse<IIssue[]>;
}

interface IssueLoading {
  type: "ISSUE_LOADING";
  payload: boolean;
}

interface SetDownload {
  type: "SET_DOWNLOAD";
  payload: boolean;
}

type KnownAction = GetIssues | ClearIssues | IssueLoading | SetDownload | GetErrors;

const unloadedState: DetailsState = {
  issues: {} as IPagedResponse<IIssue> & IResponse<IIssue[]>,
  loading: false,
  isDownload: false,
};

export const actionCreators = {
  getIssues: (filter: IIssueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    dispatch({ type: "ISSUE_LOADING", payload: true });
    axios
      .get("/api/issues/", { params: { ...filter } })
      .then((response) => dispatch({ type: "GET_ISSUES", payload: response.data }))
      .catch((error) => {
        dispatch({ type: "ISSUE_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      });
  },

  getSelectedIssues: (filter: ISelectedIIssueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        const empty: IResponse<IIssue[]> = {
          data: [],
          errors: [],
          message: "",
          succeeded: true,
        };
        dispatch({ type: "CLEAR_ISSUES", payload: empty });
        dispatch({ type: "ISSUE_LOADING", payload: true });
        const response = await axios.get("api/issues/selected", {
          params: { ...filter },
        });
        if (response) dispatch({ type: "GET_ISSUES", payload: response.data });
      } catch (error) {
        dispatch({ type: "ISSUE_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  getPaginatedIssues: (filter: IIssuePagingFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "ISSUE_LOADING", payload: false });
        const response = await axios.get("api/issues/paging", {
          params: { ...filter },
        });
        if (response) dispatch({ type: "GET_ISSUES", payload: response.data });
      } catch (error) {
        dispatch({ type: "ISSUE_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      }
    })();
  },

  getSelectedPaginatedIssues: (
    filter: ISelectedIIssuePagingFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "ISSUE_LOADING", payload: false });
        const response = await axios.get("api/issues/selected/paging", {
          params: { ...filter },
        });
        if (response) dispatch({ type: "GET_ISSUES", payload: response.data });
      } catch (error) {
        dispatch({ type: "ISSUE_LOADING", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  exportFile: (filter: IIssueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    dispatch({ type: "SET_DOWNLOAD", payload: true });
    axios
      .get("/api/issues/export", {
        params: { ...filter },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        const fileName = filter.appId === "IC" ? "CameraDeviceIssueReport.xls" : "EJIssues.xlsx";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        dispatch({ type: "SET_DOWNLOAD", payload: false });
      })
      .catch((error) => {
        dispatch({ type: "SET_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response?.data });
      });
  },
};

export const reducer: Reducer<DetailsState> = (
  state: DetailsState | undefined,
  incomingAction: Action
): DetailsState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "ISSUE_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "CLEAR_ISSUES":
      return {
        ...state,
        issues: action.payload,
      };
    case "GET_ISSUES":
      return {
        ...state,
        loading: false,
        issues: action.payload,
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

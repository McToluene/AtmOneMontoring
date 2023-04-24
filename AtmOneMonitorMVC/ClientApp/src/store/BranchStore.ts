import axios from "axios";
import { Reducer, Action } from "redux";
import { AppThunkAction } from ".";

import { IBranch } from "../Dtos/IBranch";
import { GetErrors, ClearErrors } from "./ErrorStore";
import { IPagedResponse } from "../Dtos/IPagedResponse";
import { IResponse } from "../Dtos/IResponse";
import { IPaginationFilter } from "../Dtos/IPaginationFilter";
import {
  IItemValueFilter,
  IITemValuePaginateFilter,
} from "../Dtos/IItemValueFilter";

export interface BranchState {
  branches: IPagedResponse<IBranch> & IResponse<IBranch[]>;
  isBranchLoading: boolean;
  isCreated: IResponse<boolean>;
  branch: IResponse<IBranch>;
  unAuthorizedPage: boolean;
  isDownload: boolean;
}

interface GetBranches {
  type: "GET_BRANCHES";
  payload: IPagedResponse<IBranch> & IResponse<IBranch[]>;
}

interface GetBranch {
  type: "GET_BRANCH";
  payload: IResponse<IBranch>;
}

interface SetLoading {
  type: "SET_BRANCHES_LOADING";
  payload: boolean;
}

interface SetDownload {
  type: "SET_BRANCH_DOWNLOAD";
  payload: boolean;
}

interface SetIsCreated {
  type: "SET_IS_CREATED";
  payload: IResponse<boolean>;
}

interface SetUnAuthorizedPage {
  type: "SET_BRANCH_PAGE";
  payload: boolean;
}

type KnownAction =
  | GetBranches
  | GetBranch
  | SetDownload
  | SetIsCreated
  | SetUnAuthorizedPage
  | SetLoading
  | GetErrors
  | ClearErrors;

const unloadedState: BranchState = {
  branches: {} as IPagedResponse<IBranch> & IResponse<IBranch[]>,
  isBranchLoading: false,
  isCreated: {} as IResponse<boolean>,
  branch: {} as IResponse<IBranch>,
  unAuthorizedPage: false,
  isDownload: false,
};

export const actionCreators = {
  getBranches: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function () {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.get("api/branch");
        if (response)
          dispatch({ type: "GET_BRANCHES", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getPaginatedBranches: (
    filter: IPaginationFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.get("api/branch/paging", {
          params: { ...filter },
        });
        if (response)
          dispatch({ type: "GET_BRANCHES", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  searchPaginatedBranches: (
    filter: IITemValuePaginateFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.get("api/branch/paging/search", {
          params: { ...filter },
        });
        if (response)
          dispatch({ type: "GET_BRANCHES", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  searchBranches: (filter: IItemValueFilter): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.get("api/branch/search", {
          params: { ...filter },
        });
        if (response)
          dispatch({ type: "GET_BRANCHES", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addBranch: (branch: {
    branchCode: string;
    branchName: string;
    emails: string;
  }): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.post("api/branch", branch);
        if (response)
          dispatch({ type: "SET_IS_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  addBranches: (
    branch: {
      branchCode: string;
      branchName: string;
      emails: string;
    }[]
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function post() {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.post("api/branch/list", branch);
        if (response)
          dispatch({ type: "SET_IS_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getBranch: (id: number): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: true });
        const response = await axios.get("api/branch/detail", {
          params: { id },
        });

        if (response) dispatch({ type: "GET_BRANCH", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BRANCHES_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  updateBranch: (terminal: IBranch): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function put() {
      try {
        dispatch({ payload: true, type: "SET_BRANCHES_LOADING" });
        const response = await axios.put("api/branch", terminal);
        if (response)
          dispatch({ type: "SET_IS_CREATED", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_BRANCHES_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BRANCH_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  export: (branchFilter: IItemValueFilter): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BRANCH_DOWNLOAD", payload: true });
        const response = await axios.get("/api/branch/export", {
          params: { ...branchFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Branches.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_BRANCH_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_BRANCH_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<BranchState> = (
  state: BranchState | undefined,
  incomingAction: Action
): BranchState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_BRANCHES":
      return {
        ...state,
        isBranchLoading: false,
        branches: action.payload,
      };
    case "SET_BRANCHES_LOADING":
      return {
        ...state,
        isBranchLoading: action.payload,
      };
    case "SET_IS_CREATED":
      return {
        ...state,
        isBranchLoading: false,
        isCreated: action.payload,
      };
    case "GET_BRANCH":
      return {
        ...state,
        isBranchLoading: false,
        branch: action.payload,
      };
    case "SET_BRANCH_PAGE":
      return {
        ...state,
        isBranchLoading: false,
        unAuthorizedPage: action.payload,
      };
    case "SET_BRANCH_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    default:
      return state;
  }
};

import { AppThunkAction } from ".";
import { Reducer, Action } from "redux";
import axios from "axios";

import { IAuditTrail, IAuditTrailDetail } from "../Dtos/IAuditTrail";
import { GetErrors, ClearErrors } from "./ErrorStore";
import { IPagedResponse } from "../Dtos/IPagedResponse";
import { IPaginationFilter } from "../Dtos/IPaginationFilter";
import { IResponse } from "../Dtos/IResponse";
import IAuditFilter from "../Dtos/IAuditFilter";

export interface AuditTrailState {
  loading: boolean;
  unAuthorizedPage: boolean;
  auditTrails: IPagedResponse<IAuditTrail> & IResponse<IAuditTrail[]>;
  auditTrail: IResponse<IAuditTrailDetail>;
  isDownload: boolean;
}

interface GetAuditTrails {
  type: "GET_AUDIT_TRAILS";
  payload: IPagedResponse<IAuditTrail> & IResponse<IAuditTrail[]>;
}

interface SetLoading {
  type: "SET_AUDIT_LOADING";
  payload: boolean;
}

interface GetFilteredAuditTrails {
  type: "GET_FILTERED_AUDIT_TRAIL";
  payload: IPagedResponse<IAuditTrail> & IResponse<IAuditTrail[]>;
}

interface GetAuditTrailDetail {
  type: "GET_AUDIT_TRAIL_DETAIL";
  payload: IResponse<IAuditTrailDetail>;
}

interface SetUnAuthorizedPage {
  type: "SET_AUDIT_TRAIL_PAGE";
  payload: boolean;
}

interface SetDownload {
  type: "SET_AUDIT_TRAIL_DOWNLOAD";
  payload: boolean;
}

const unloadedState: AuditTrailState = {
  loading: false,
  unAuthorizedPage: false,
  auditTrails: {} as IPagedResponse<IAuditTrail> & IResponse<IAuditTrail[]>,
  auditTrail: {} as IResponse<IAuditTrailDetail>,
  isDownload: false,
};

type KnownAction =
  | GetAuditTrails
  | SetLoading
  | SetDownload
  | GetFilteredAuditTrails
  | GetAuditTrailDetail
  | SetUnAuthorizedPage
  | GetErrors
  | ClearErrors;

export const actionCreators = {
  getTrailsByPaging: (
    filter: IPaginationFilter
  ): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_AUDIT_LOADING" });
        const response = await axios.get("/api/audits/paging", {
          params: { pageNumber: filter.pageNumber, pageSize: filter.pageSize },
        });
        if (response)
          dispatch({ type: "GET_AUDIT_TRAILS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_AUDIT_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_AUDIT_TRAIL_PAGE",
          });
        }
        dispatch({ payload: error.response.data, type: "GET_ERRORS" });
      }
    })();
  },

  getTrails: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_AUDIT_LOADING" });
        const response = await axios.get("/api/audits");
        if (response)
          dispatch({ type: "GET_AUDIT_TRAILS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_AUDIT_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_AUDIT_TRAIL_PAGE",
          });
        }
        dispatch({ payload: error.response.data, type: "GET_ERRORS" });
      }
    })();
  },

  getFilteredTrails: (value: IAuditFilter): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_AUDIT_LOADING" });
        const response = await axios.get("/api/audits/filter", {
          params: { ...value },
        });
        if (response)
          dispatch({
            type: "GET_FILTERED_AUDIT_TRAIL",
            payload: response.data,
          });
      } catch (error) {
        dispatch({ payload: false, type: "SET_AUDIT_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_AUDIT_TRAIL_PAGE",
          });
        }
        dispatch({ payload: error.response.data, type: "GET_ERRORS" });
      }
    })();
  },

  getAuditTrailDetail: (auditId: number): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_AUDIT_LOADING" });
        const response = await axios.get("/api/audits/detail", {
          params: { auditId },
        });
        if (response)
          dispatch({
            type: "GET_AUDIT_TRAIL_DETAIL",
            payload: response.data,
          });
      } catch (error) {
        dispatch({ payload: false, type: "SET_AUDIT_LOADING" });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_AUDIT_TRAIL_PAGE",
          });
        }
        dispatch({ payload: error.response.data, type: "GET_ERRORS" });
      }
    })();
  },

  export: (auditFilter: IAuditFilter): AppThunkAction<KnownAction> => (
    dispatch
  ) => {
    (async function get() {
      try {
        dispatch({ type: "SET_AUDIT_TRAIL_DOWNLOAD", payload: true });
        const response = await axios.get("/api/audits/export", {
          params: { ...auditFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "AuditTrail.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_AUDIT_TRAIL_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_AUDIT_TRAIL_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<AuditTrailState> = (
  state: AuditTrailState | undefined,
  incomingAction: Action
): AuditTrailState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_AUDIT_TRAILS":
      return {
        ...state,
        auditTrails: action.payload,
        loading: false,
      };
    case "SET_AUDIT_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_FILTERED_AUDIT_TRAIL":
      return {
        ...state,
        auditTrails: action.payload,
        loading: false,
      };
    case "GET_AUDIT_TRAIL_DETAIL":
      return {
        ...state,
        auditTrail: action.payload,
        loading: false,
      };
    case "SET_AUDIT_TRAIL_PAGE":
      return {
        ...state,
        unAuthorizedPage: action.payload,
      };
    case "SET_AUDIT_TRAIL_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    default:
      return state;
  }
};

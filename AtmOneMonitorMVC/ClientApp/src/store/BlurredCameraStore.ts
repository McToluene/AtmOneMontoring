import { Reducer, Action } from "redux";
import axios from "axios";

import { IBlurredTerminal } from "../Dtos/ITerminal";
import { IResponse } from "../Dtos/IResponse";
import { GetErrors, ClearErrors } from "./ErrorStore";
import { IDateItemValueFilter } from "../Dtos/IDateItemValueFilter";
import { AppThunkAction } from ".";

export interface BlurredCameraState {
  loading: boolean;
  cameras: IResponse<IBlurredTerminal[]>;
  unAuthorizedPage: boolean;
  isDownload: boolean;
}

interface GetBlurredTerminals {
  type: "GET_BLURRED_TERMINALS";
  payload: IResponse<IBlurredTerminal[]>;
}

interface ClearBlurredTerminals {
  type: "CLEAR_BLURRED_TERMINALS";
  payload: IResponse<IBlurredTerminal[]>;
}

interface SetLoading {
  type: "SET_BLURRED_TERMINALS_LOADING";
  payload: boolean;
}

interface SetUnAuthorizedPage {
  type: "SET_BLURRED_CAMERA_PAGE";
  payload: boolean;
}

interface SetDownload {
  type: "SET_BLURRED_CAMERA_DOWNLOAD";
  payload: boolean;
}

type KnownAction =
  | GetBlurredTerminals
  | ClearBlurredTerminals
  | SetDownload
  | SetLoading
  | SetUnAuthorizedPage
  | GetErrors
  | ClearErrors;

const unloadedState: BlurredCameraState = {
  cameras: {} as IResponse<IBlurredTerminal[]>,
  isDownload: false,
  loading: false,
  unAuthorizedPage: false,
};

export const actionCreators = {
  getBlurredCameras: (filter: IDateItemValueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BLURRED_TERMINALS_LOADING", payload: true });
        const response = await axios.get("/api/blurredcameras", {
          params: { ...filter },
        });

        if (response) dispatch({ type: "GET_BLURRED_TERMINALS", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BLURRED_TERMINALS_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({
            payload: true,
            type: "SET_BLURRED_CAMERA_PAGE",
          });
        }

        if (error.response.headers.status === "401") {
          dispatch({
            payload: true,
            type: "SET_BLURRED_CAMERA_PAGE",
          });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  getBlurredCamerasByMinute: (minutes: number): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BLURRED_TERMINALS_LOADING", payload: true });
        const response = await axios.get("/api/blurredcameras/minutes", {
          params: { minutes },
        });

        if (response) dispatch({ type: "GET_BLURRED_TERMINALS", payload: response.data });
      } catch (error) {
        dispatch({ type: "SET_BLURRED_TERMINALS_LOADING", payload: false });
        if (error.response.headers.status === "403") {
          dispatch({ payload: true, type: "SET_BLURRED_CAMERA_PAGE" });
        }

        if (error.response.headers.status === "401") {
          dispatch({ payload: true, type: "SET_BLURRED_CAMERA_PAGE" });
        }
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },

  // getPaginatedBlurredCameras: (
  //   filter: IDateItemValuePaginateFilter
  // ): AppThunkAction<KnownAction> => (dispatch) => {
  //   (async function get() {
  //     try {
  //       dispatch({ type: "SET_BLURRED_TERMINALS_LOADING", payload: true });
  //       const response = await axios.get("/api/blurredcameras/paging", {
  //         params: { ...filter },
  //       });

  //       if (response) dispatch({ type: "GET_BLURRED_TERMINALS", payload: response.data });
  //     } catch (error) {
  //       dispatch({ type: "SET_BLURRED_TERMINALS_LOADING", payload: false });
  //       if (error.response.headers.status === "403") {
  //         dispatch({ payload: true, type: "SET_BLURRED_CAMERA_PAGE" });
  //       }

  //       if (error.response.headers.status === "401") {
  //         dispatch({ payload: true, type: "SET_BLURRED_CAMERA_PAGE" });
  //       }
  //       dispatch({ type: "GET_ERRORS", payload: error.response.data });
  //     }
  //   })();
  // },

  export: (terminalFilter: IDateItemValueFilter): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ type: "SET_BLURRED_CAMERA_DOWNLOAD", payload: true });
        const response = await axios.get("/api/blurredcameras/export", {
          params: { ...terminalFilter },
          responseType: "blob",
        });
        if (response) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "BlurredCameras.xls");
          document.body.appendChild(link);
          link.click();
          dispatch({ type: "SET_BLURRED_CAMERA_DOWNLOAD", payload: false });
        }
      } catch (error) {
        dispatch({ type: "SET_BLURRED_CAMERA_DOWNLOAD", payload: false });
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<BlurredCameraState> = (
  state: BlurredCameraState | undefined,
  incomingAction: Action
): BlurredCameraState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;

  switch (action.type) {
    case "SET_BLURRED_TERMINALS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_BLURRED_TERMINALS":
      return {
        ...state,
        loading: false,
        cameras: action.payload,
      };
    case "CLEAR_BLURRED_TERMINALS":
      return {
        ...state,
        cameras: action.payload,
      };
    case "SET_BLURRED_CAMERA_PAGE":
      return {
        ...state,
        loading: false,
        unAuthorizedPage: action.payload,
      };
    case "SET_BLURRED_CAMERA_DOWNLOAD":
      return {
        ...state,
        isDownload: action.payload,
      };
    default:
      return state;
  }
};

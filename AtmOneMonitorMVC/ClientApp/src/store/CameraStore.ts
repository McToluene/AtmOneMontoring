import axios from "axios";
import { Reducer, Action } from "redux";

import { AppThunkAction } from ".";
import { ICamera } from "../Dtos/ICamera";
import { GetErrors } from "./ErrorStore";

export interface CameraState {
  camera: ICamera;
  loading: boolean;
}

interface SetCameraDetails {
  type: "SET_CAMERA_DETAILS";
  payload: ICamera;
}

interface ClearCameraDetails {
  type: "CLEAR_CAMERA_DETAILS";
  payload: {};
}

interface SetLoading {
  type: "SET_CAMERA_LOADING";
  payload: boolean;
}

type KnownAction = SetCameraDetails | SetLoading | ClearCameraDetails | GetErrors;

const unloadedState: CameraState = {
  camera: {} as ICamera,
  loading: false,
};

export const actionCreators = {
  fetchCamera: (): AppThunkAction<KnownAction> => (dispatch) => {
    dispatch({ payload: true, type: "SET_CAMERA_LOADING" });
    axios
      .get("/api/issues/cameras")
      .then((response) =>
        dispatch({
          type: "SET_CAMERA_DETAILS",
          payload: response?.data,
        })
      )
      .catch((error) => {
        dispatch({ payload: false, type: "SET_CAMERA_LOADING" });
        dispatch({ payload: error.response?.data, type: "GET_ERRORS" });
      });
  },
};

export const reducer: Reducer<CameraState> = (
  state: CameraState | undefined,
  incomingAction: Action
): CameraState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "SET_CAMERA_DETAILS":
      return {
        ...state,
        loading: false,
        camera: action.payload,
      };
    case "SET_CAMERA_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

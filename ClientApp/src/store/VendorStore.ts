import axios from "axios";
import { Reducer, Action } from "redux";
import { AppThunkAction } from ".";

import { IVendor } from "../Dtos/IVendor";
import { GetErrors, ClearErrors } from "./ErrorStore";

export interface VendorState {
  vendors: IVendor[];
  loading: boolean;
}

interface GetVendors {
  type: "GET_VENDORS";
  payload: IVendor[];
}

interface SetVendorsLoading {
  type: "SET_VENDORS_LOADING";
  payload: boolean;
}

type KnownAction = GetVendors | SetVendorsLoading | GetErrors | ClearErrors;

const unloadedState: VendorState = {
  vendors: [],
  loading: false,
};

export const actionCreators = {
  getVendors: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function fetch() {
      try {
        dispatch({ type: "SET_VENDORS_LOADING", payload: true });
        const response = await axios.get("api/vendor");
        if (response) dispatch({ type: "GET_VENDORS", payload: response.data });
      } catch (error) {
        dispatch({ type: "GET_ERRORS", payload: error.response.data });
      }
    })();
  },
};

export const reducer: Reducer<VendorState> = (
  state: VendorState | undefined,
  incomingAction: Action
): VendorState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_VENDORS":
      return {
        ...state,
        loading: false,
        vendors: action.payload,
      };

    case "SET_VENDORS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

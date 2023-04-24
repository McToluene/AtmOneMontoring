import { Action, Reducer } from "redux";

export interface ErrorState {
  errors?: any;
}

export interface GetErrors {
  type: "GET_ERRORS";
  payload: any;
}

export interface ClearErrors {
  type: "CLEAR_ERRORS";
}

type KnownAction = GetErrors | ClearErrors;

const unloadedState: ErrorState = {
  errors: {},
};

export const reducer: Reducer<ErrorState> = (
  state: ErrorState | undefined,
  incomingAction: Action
): ErrorState => {
  if (state === undefined) return unloadedState;

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "GET_ERRORS":
      return {
        ...state,
        errors: action.payload,
      };
    case "CLEAR_ERRORS":
      return {};
    default:
      return state;
  }
};

import { Reducer, Action } from "redux";
import axios from "axios";

import { AppThunkAction } from ".";
import { IElectronicJournal } from "../Dtos/IElectronicJournal";
import { GetErrors } from "./ErrorStore";

export interface ElectronicJournalState {
  ej: IElectronicJournal;
  loading: boolean;
}

interface SetEjectDetails {
  type: "SET_ELECTRONIC_JOURNAL_DETAILS";
  payload: IElectronicJournal;
}

interface SetLoading {
  type: "SET_ELECTRONIC_JOURNAL_LOADING";
  payload: boolean;
}

type KnownAction = SetEjectDetails | SetLoading | GetErrors;

const unloadedState: ElectronicJournalState = {
  ej: {} as IElectronicJournal,
  loading: false,
};

export const actionCreators = {
  fetchElectronicJournal: (): AppThunkAction<KnownAction> => (dispatch) => {
    (async function get() {
      try {
        dispatch({ payload: true, type: "SET_ELECTRONIC_JOURNAL_LOADING" });
        const response = await axios.get("/api/issues/ejs");
        if (response) dispatch({ type: "SET_ELECTRONIC_JOURNAL_DETAILS", payload: response.data });
      } catch (error) {
        dispatch({ payload: false, type: "SET_ELECTRONIC_JOURNAL_LOADING" });
        dispatch({ payload: error?.response?.data, type: "GET_ERRORS" });
      }
    })();
  },
};

export const reducer: Reducer<ElectronicJournalState> = (
  state: ElectronicJournalState | undefined,
  incomingAction: Action
): ElectronicJournalState => {
  if (state === undefined) {
    return unloadedState;
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "SET_ELECTRONIC_JOURNAL_DETAILS":
      return {
        ...state,
        loading: false,
        ej: action.payload,
      };
    case "SET_ELECTRONIC_JOURNAL_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

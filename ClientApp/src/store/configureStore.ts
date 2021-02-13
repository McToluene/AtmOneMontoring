import { AnyAction, applyMiddleware, CombinedState, combineReducers, compose, createStore, Reducer, } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { ApplicationState, reducers } from "./";

import { AuthenticationState } from "./AuthenticationStore";
import { ErrorState } from "./ErrorStore";
import { UsersState } from "./UsersStore";
import { CameraState } from "./CameraStore";
import { ElectronicJournalState } from "./ElectronicJournalStore";
import { DetailsState } from "./DetailsStore";
import { RoleState } from "./RoleStore";
import { BranchState } from "./BranchStore";
import { VendorState } from "./VendorStore";
import { TerminalState } from "./TerminalStore";
import { OnlineTerminalState } from "./OnlineTerminalsStore";
import { VendorConfigState } from "./VendorConfigStore";
import { TerminalConfigState } from "./TerminalConfigStore";
import { BlurredCameraState } from "./BlurredCameraStore";
import { OperationLogsState } from "./OperationLogsStore";
import { AuditTrailState } from "./AuditTrailStore";

export default function configureStore(
  history: History,
  initialState?: ApplicationState
) {
  const middleware = [thunk, routerMiddleware(history)];

  const appReducer = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });

  const unloadedState: any = {};

  const rootReducer: Reducer<
    CombinedState<{
      router: RouterState<unknown>;
      auth: AuthenticationState;
      errors: ErrorState;
      camera: CameraState;
      electronicJournal: ElectronicJournalState;
      issue: DetailsState;
      users: UsersState;
      roles: RoleState;
      branch: BranchState;
      vendor: VendorState;
      terminal: TerminalState;
      onlineTerminal: OnlineTerminalState;
      vendorConfig: VendorConfigState;
      terminalConfig: TerminalConfigState;
      blurred: BlurredCameraState;
      operationLog: OperationLogsState;
      auditTrail: AuditTrailState
    }>,
    AnyAction | LocationChangeAction<unknown>
  > = (
    state:
      | CombinedState<{
        router: RouterState<unknown>;
        auth: AuthenticationState;
        errors: ErrorState;
        camera: CameraState;
        electronicJournal: ElectronicJournalState;
        issue: DetailsState;
        users: UsersState;
        roles: RoleState;
        branch: BranchState;
        vendor: VendorState;
        terminal: TerminalState;
        onlineTerminal: OnlineTerminalState;
        vendorConfig: VendorConfigState;
        terminalConfig: TerminalConfigState;
        blurred: BlurredCameraState;
        operationLog: OperationLogsState;
        auditTrail: AuditTrailState
      }>
      | undefined,
    action: AnyAction | LocationChangeAction<unknown>
  ): any => {
      if (action.type === "RESET_STATE") return unloadedState;
      return appReducer(state, action);
    };

  const enhancers = [];
  const windowIfDefined =
    typeof window === "undefined" ? null : (window as any);
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}

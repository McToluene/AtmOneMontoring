import * as Authentication from "./AuthenticationStore";
import * as PageError from "./ErrorStore";
import * as Camera from "./CameraStore";
import * as ElectronicJournal from "./ElectronicJournalStore";
import * as Details from "./DetailsStore";
import * as Users from "./UsersStore";
import * as Role from "./RoleStore";
import * as Branch from "./BranchStore";
import * as Vendor from "./VendorStore";
import * as Terminal from "./TerminalStore";
import * as OnlineTerminal from "./OnlineTerminalsStore";
import * as AuditTrail from "./AuditTrailStore";
import * as OperationLog from "./OperationLogsStore";
import * as VendorConfig from "./VendorConfigStore";
import * as TerminalConfig from "./TerminalConfigStore";
import * as BlurredCamera from "./BlurredCameraStore";

// The top-level state object
export interface ApplicationState {
  auth: Authentication.AuthenticationState | undefined;
  errors: PageError.ErrorState | undefined;
  camera: Camera.CameraState | undefined;
  electronicJournal: ElectronicJournal.ElectronicJournalState | undefined;
  issue: Details.DetailsState | undefined;
  users: Users.UsersState | undefined;
  roles: Role.RoleState | undefined;
  branch: Branch.BranchState | undefined;
  vendor: Vendor.VendorState | undefined;
  terminal: Terminal.TerminalState | undefined;
  onlineTerminal: OnlineTerminal.OnlineTerminalState | undefined;
  vendorConfig: VendorConfig.VendorConfigState | undefined;
  terminalConfig: TerminalConfig.TerminalConfigState | undefined;
  blurred: BlurredCamera.BlurredCameraState | undefined;
  operationLog: OperationLog.OperationLogsState | undefined;
  auditTrail: AuditTrail.AuditTrailState | undefined;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
  auth: Authentication.reducer,
  errors: PageError.reducer,
  camera: Camera.reducer,
  electronicJournal: ElectronicJournal.reducer,
  issue: Details.reducer,
  users: Users.reducer,
  roles: Role.reducer,
  branch: Branch.reducer,
  vendor: Vendor.reducer,
  terminal: Terminal.reducer,
  onlineTerminal: OnlineTerminal.reducer,
  vendorConfig: VendorConfig.reducer,
  terminalConfig: TerminalConfig.reducer,
  blurred: BlurredCamera.reducer,
  operationLog: OperationLog.reducer,
  auditTrail: AuditTrail.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

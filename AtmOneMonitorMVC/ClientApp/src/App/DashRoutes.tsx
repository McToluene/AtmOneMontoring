import React, { Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "./layouts/Loader/Loader";

const Login = React.lazy(() => import("./components/Login/Login"));
const Dashboard = React.lazy(() => import("./Pages/Dashboard/Index"));
const CameraPage = React.lazy(() => import("./Pages/Camera/Camera"));
const ElectronicJournal = React.lazy(() => import("./Pages/ElectronicJournal/ElectronicJournal"));
const DetailsPage = React.lazy(() => import("./Pages/Details/Details"));
const CreateUser = React.lazy(() => import("./Pages/User/CreateUser"));
const ViewUser = React.lazy(() => import("./Pages/User/ViewUser"));
const EditUser = React.lazy(() => import("./Pages/User/EditUser"));
const RolePrivilege = React.lazy(() => import("./Pages/Role/RolePrivilege"));
const AccesRight = React.lazy(() => import("./Pages/Role/AccessRight"));
const AddTerminal = React.lazy(() => import("./Pages/Terminal/AddTerminal/AddTerminal"));
const ViewTerminal = React.lazy(() => import("./Pages/Terminal/ViewTerminal/ViewTerminal"));
const ConnectedTerminals = React.lazy(
  () => import("./Pages/Terminal/ConnetedTerminals/ConnectedTerminals")
);
const LicenseInfo = React.lazy(() => import("./Pages/Terminal/LicenseInfo/LicenseInfo"));
const AddBranch = React.lazy(() => import("./Pages/Branch/AddBranch"));
const ViewBranch = React.lazy(() => import("./Pages/Branch/ViewBranch"));
const AuditTrail = React.lazy(() => import("./Pages/Audit/AuditTrail"));
const BlurredCameras = React.lazy(() => import("./Pages/BlurredCamera/BlurredCamera"));
const AuditDetail = React.lazy(() => import("./Pages/Audit/AuditTrailDetail"));
const OperationLogs = React.lazy(() => import("./Pages/OperationLogs/OperationLogs"));

const VendorConfiguration = React.lazy(
  () => import("./Pages/Configuration/VendorConfiguration/VendorConfiguration")
);

const ViewVendorConfig = React.lazy(() => import("./Pages/Configuration/ViewVendorConfig"));

const TerminalConfiguration = React.lazy(
  () => import("./Pages/Configuration/TerminalConfiguration/TerminalConfiguration")
);

const ViewTerminalConfig = React.lazy(
  () => import("./Pages/Configuration/ViewTerminalConfiguration/ViewTerminalConfig")
);

const TerminalConfigDetail = React.lazy(
  () => import("./Pages/Configuration/ViewTerminalConfiguration/TerminalConfigDetail")
);

const ConfigApproval = React.lazy(() => import("./Pages/Configuration/ConfigApproval"));
const Error401 = React.lazy(() => import("./Pages/Error/Error401"));

const DashRoutes = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route exact path="/auth/login" component={Login} />
        <Route exact path="/dashboard/index" component={Dashboard} />
        <Route exact path="/dashboard/camera" component={CameraPage} />
        <Route exact path="/dashboard/electronicjournal" component={ElectronicJournal} />
        <Route exact path="/dashboard/reports" component={DetailsPage} />
        <Route exact path="/user/createuser" component={CreateUser} />
        <Route exact path="/user/viewuser" component={ViewUser} />
        <Route exact path="/user/edit" component={EditUser} />
        <Route exact path="/role/roleprivilege" component={RolePrivilege} />
        <Route exact path="/role/accessright" component={AccesRight} />
        <Route exact path="/terminal/addterminal" component={AddTerminal} />
        <Route exact path="/terminal/viewterminal" component={ViewTerminal} />
        <Route exact path="/terminal/connectedterminals" component={ConnectedTerminals} />
        <Route exact path="/terminal/licenseinfo" component={LicenseInfo} />
        <Route exact path="/branch/addbranch" component={AddBranch} />
        <Route exact path="/branch/viewbranch" component={ViewBranch} />
        <Route exact path="/configuration/vendorconfiguration" component={VendorConfiguration} />
        <Route exact path="/configuration/viewvendorconfiguration" component={ViewVendorConfig} />
        <Route
          exact
          path="/configuration/terminalconfiguration"
          component={TerminalConfiguration}
        />
        <Route
          exact
          path="/configuration/viewterminalconfiguration"
          component={ViewTerminalConfig}
        />
        <Route
          exact
          path="/configuration/viewterminalconfigurationdetail"
          component={TerminalConfigDetail}
        />
        <Route exact path="/configuration/configapproval" component={ConfigApproval} />
        <Route exact path="/logs/blurredcameras" component={BlurredCameras} />
        <Route exact path="/logs/accesslog" component={OperationLogs} />
        <Route exact path="/audittrail" component={AuditTrail} />
        <Route exact path="/audittrail/detail" component={AuditDetail} />
        <Route exact path="/unauthorized" component={Error401} />
        <Redirect from="/" to="/auth/login" />
      </Switch>
    </Suspense>
  );
};

export default DashRoutes;

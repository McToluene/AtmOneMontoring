import React, { useState, useEffect, useCallback } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Spinner,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import * as ApplicationStore from "../../../../store/index";
import * as OnlineTerminalStore from "../../../../store/OnlineTerminalsStore";
import * as AuthenticationStore from "../../../../store/AuthenticationStore";
import { ILicenseInfo } from "../../../../Dtos/ILicenseInfo";
import { isEmpty } from "../../../../utils/isEmpty";

const LicenseInfo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [license, setLicense] = useState("");
  const [licenseInfo, setLicenseInfo] = useState<ILicenseInfo>({
    lic: "",
    used: "",
  });

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("licenseinfo"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const showBlockMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      history.push("/unauthorized");
    }
  }, [userPrivilegeLoading, unAuthorizedPage, rolePrivilege]);

  useEffect(() => {
    showBlockMessage();
  }, [unAuthorizedPage, showBlockMessage]);

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.loading
  );

  const info = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.licenseInfo
  );

  const isAdded = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.isAdded
  );

  useEffect(() => {
    dispatch(OnlineTerminalStore.actionCreators.getLicenseInfo());
  }, [dispatch]);

  const onLicenseFetched = useCallback(() => {
    if (info) setLicenseInfo(info.data);
  }, [info, setLicenseInfo]);

  useEffect(() => {
    onLicenseFetched();
  }, [onLicenseFetched]);

  const onSubmitLicenseHandler = () => {
    dispatch(OnlineTerminalStore.actionCreators.addLicense(license));
    setIsLoading((isLoading) => !isLoading);
  };

  // must change this
  const showMessage = useCallback(() => {
    if (isAdded?.data) {
      addToast("License info added succesffully", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Wrong License Data", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [isAdded, addToast]);

  useEffect(() => {
    if (isLoading && !loading) {
      showMessage();
    }
  }, [isLoading, loading, showMessage]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-console-network text-info mr-1" />
                  Terminal
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-information-outline text-info mr-1" />
                  License Info
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="rounded-0">
            <Card.Header className="container-fluid bg-white">
              <Row>
                <Col md={10}>
                  <div className="float-left">
                    <i className="mdi mdi-information-outline text-success icon-sm mr-2" />
                    <h5 className="d-inline">License Info</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Col sm={10}>
                <Row className="mb-5">
                  <Col>
                    <h5>
                      License Information:{" "}
                      {loading ? (
                        <Spinner
                          variant="success"
                          animation="border"
                          role="status"
                          size="sm"
                          aria-hidden="true"
                        />
                      ) : (
                        <b>
                          [{licenseInfo?.used} / {licenseInfo?.lic} ]
                        </b>
                      )}
                    </h5>
                  </Col>
                </Row>
                <Form.Row className="align-items-center justify-content-between">
                  <FormGroup as={Col} sm={9}>
                    <FormLabel>License</FormLabel>
                    <FormControl
                      value={license}
                      onChange={(event) => setLicense(event?.target.value)}
                      size="lg"
                      className="rounded-0"
                      placeholder="Enter License"
                    />
                  </FormGroup>
                  <Col sm={2}>
                    <Button
                      type="submit"
                      variant="outline-success"
                      size="lg"
                      onClick={onSubmitLicenseHandler}
                      block
                      disabled={loading}
                      className="rounded-0"
                    >
                      <i className="mdi mdi-content-save-outline align-middle " />
                      <span className="align-middle px-2"> Save </span>
                      {isLoading ? (
                        <Spinner
                          variant="success"
                          animation="border"
                          role="status"
                          size="sm"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Button>
                  </Col>
                </Form.Row>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default LicenseInfo;

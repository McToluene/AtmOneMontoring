import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import * as AuthenticationStore from "../../../../store/AuthenticationStore";
import * as ApplicationStore from "../../../../store/index";
import * as TerminalConfigStore from "../../../../store/TerminalConfigStore";
import {
  ITerminalConfiguration,
  ITerminalVendor,
  ITerminalConfigurationCreate,
} from "../../../../Dtos/ITerminal";
import { Col, Card, Row, Button, Spinner, Tab, Nav } from "react-bootstrap";
import { Formik } from "formik";
import TerminalSelection from "./TerminalSelection";
import Brightness from "./Brightness";
import Settings from "./Settings";
import { isEmpty } from "../../../../utils/isEmpty";
import { useToasts } from "react-toast-notifications";

const TerminalConfiguration = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("terminalconfiguration"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const showMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      history.push("/unauthorized");
    }
  }, [userPrivilegeLoading, unAuthorizedPage, rolePrivilege]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.loading
  );

  const isAdded = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.isAdded.data
  );

  const detail = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.terminalConfig
  );

  const terminalConfigId = history.location.state;
  const updateOrCreate = terminalConfigId !== undefined ? "Update" : "Create";
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (terminalConfigId !== undefined) {
      dispatch(
        TerminalConfigStore.actionCreators.getTerminalConfig(
          parseInt(String(terminalConfigId).toString())
        )
      );
      setIsUpdate(true);
    }
  }, [terminalConfigId, dispatch]);

  const [isClicked, setIsClicked] = useState(false);
  const [terminalConfig, setTerminalConfig] = useState<ITerminalConfiguration>({
    debugLevel: 0,
    escalationDelayTimeInMin: 0,
    imageBrightness: 0.17,
    intelliCamEnabled: false,
    manageCapturing: false,
    nightSensitivity: 0.085,
    sendAlert: false,
    validationMode: "face_only",
    vendorConfigId: 1,
    vendorId: 1,
  });

  const onDetailFetch = useCallback(() => {
    if (detail?.data) {
      setTerminalConfig(detail.data);
    }
  }, [detail, setTerminalConfig]);

  useEffect(() => {
    if (detail) onDetailFetch();
  }, [detail, onDetailFetch]);

  const onCreateMessage = useCallback(() => {
    if (isAdded) {
      addToast(
        `Terminal configuration successfully ${
          terminalConfigId !== undefined ? "updated" : "created"
        }!`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    } else {
      addToast(
        `Failed to ${terminalConfigId !== undefined ? "update" : "create"} terminal configuration!`,
        {
          appearance: "error",
          autoDismiss: true,
        }
      );
    }
    dispatch({ type: "SET_IS_TERMINAL_CREATED", payload: false });
  }, [isAdded, , dispatch]);

  useEffect(() => {
    if (!loading && isClicked) {
      onCreateMessage();
      setIsClicked(false);
    }
  }, [loading, isClicked, onCreateMessage, setIsClicked]);

  useEffect(() => {
    return () => setIsUpdate(false);
  }, []);

  const [selectedTerminals, setSelectedTerminals] = useState<ITerminalVendor[]>([]);

  const getBrightness = (value: number): number => {
    if (value > 0.24 || value < 0.07) value = 0.17;
    return value;
  };

  const getSensitivity = (value: number): number => {
    if (value > 0.1) value = 0.085;
    return value;
  };

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-cog-outline text-info mr-1" />
                  Configuration
                </li>
                <li className="breadcrumb-item">
                  <i className="mdi mdi-cog-sync-outline text-info mr-1" />
                  Terminal Configuration
                </li>
              </ol>
            </nav>

            <nav className="ml-auto" aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a
                    href="!#"
                    onClick={(event) => {
                      event.preventDefault();
                      history.push("/configuration/viewvendorconfiguration");
                    }}
                  >
                    <i className="mdi mdi-file-cog-outline text-info mr-1" />
                    View Terminal Configuration
                  </a>
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
                <Col>
                  <div className="float-left">
                    <i className="mdi mdi-cog-sync-outline text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Terminal Configuration</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Formik
                enableReinitialize={true}
                initialValues={terminalConfig}
                validate={(values) => {
                  const errors = {} as Error;

                  return errors;
                }}
                onSubmit={(values) => {
                  const prepareValues: ITerminalConfigurationCreate = {
                    debugLevel: values.debugLevel,
                    escalationDelayTimeInMin: values.escalationDelayTimeInMin,
                    imageBrightness: getBrightness(values.imageBrightness),
                    intelliCamEnabled: values.intelliCamEnabled,
                    manageCapturing: values.manageCapturing,
                    nightSensitivity: getSensitivity(values.nightSensitivity),
                    selectedTerminals: selectedTerminals,
                    sendAlert: values.sendAlert,
                    validationMode: values.validationMode,
                    vendorConfigId: values.vendorConfigId,
                  };
                  if (!terminalConfigId)
                    dispatch(TerminalConfigStore.actionCreators.addTerminalConfig(prepareValues));
                  setIsClicked((isClicked) => !isClicked);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit}>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                      <Row>
                        <Col sm={3}>
                          <Nav variant="pills" className="flex-column rounded-0">
                            <Nav.Item>
                              <Nav.Link className="rounded-0" eventKey="first">
                                <i className="mdi mdi-selection-marker mr-2" />
                                Terminal Selection
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link className="rounded-0" eventKey="second">
                                <i className="mdi mdi-cog mr-2" />
                                Settings
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link className="rounded-0" eventKey="third">
                                <i className="mdi mdi-image-off mr-2" />
                                Brightness
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        <Col sm={9}>
                          <Tab.Content>
                            <Tab.Pane eventKey="first">
                              <TerminalSelection
                                isUpdate={isUpdate}
                                selectedTerminals={selectedTerminals}
                                setSelectedTerminals={setSelectedTerminals}
                                onChange={formik.handleChange}
                                vendor={formik.values.vendorId}
                                vendorConfigId={formik.values.vendorConfigId}
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <Settings
                                debugLogLevel={formik.values.debugLevel}
                                enable={formik.values.intelliCamEnabled}
                                esclationDelay={formik.values.escalationDelayTimeInMin}
                                manageCapturing={formik.values.manageCapturing}
                                onChange={formik.handleChange}
                                sendAlert={formik.values.sendAlert}
                                validationMode={formik.values.validationMode}
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="third">
                              <Brightness
                                imageBrightness={formik.values.imageBrightness}
                                nightSensitivity={formik.values.nightSensitivity}
                                onChange={formik.handleChange}
                              />
                            </Tab.Pane>
                          </Tab.Content>
                          <Col className="mt-3">
                            <Button
                              className="rounded-0"
                              type="submit"
                              size="sm"
                              variant="outline-success"
                            >
                              <span className="px-3">{updateOrCreate}</span>
                              {isClicked ? (
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              ) : null}
                            </Button>
                          </Col>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default TerminalConfiguration;

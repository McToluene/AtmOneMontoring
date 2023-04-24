import React, { useState, useCallback, useEffect } from "react";
import { Card, Col, Row, Tab, Nav, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import Settings from "./Settings";
import ImageEventsExclusion from "./ImageEventsExclusion";
import VendorSelection from "./VendorSelection";
import { IVendorConfiguration } from "../../../../Dtos/IVendor";
import * as ApplicationStore from "../../../../store/index";
import * as VendorConfigStore from "../../../../store/VendorConfigStore";
import * as AuthenticationStore from "../../../../store/AuthenticationStore";
import { isEmpty } from "../../../../utils/isEmpty";

type Error = {
  vendorConfigName: string;
  imageFilter: string;
  imagePath: string;
  atmLogPath: string;
  atmLogFilter: string;
  ejPath: string;
  ejFilter: string;
};

const VendorConfiguration = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("vendorconfiguration"));
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
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.loading
  );

  const isAdded = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.isAdded.data
  );

  const detail = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.vendorConfig
  );

  const [isClicked, setIsClicked] = useState(false);

  const [vendorConfig, setVendorConfig] = useState<IVendorConfiguration>({
    appId: "IC",
    atmLogPath: "",
    atmLogFilter: "",
    ejFilter: "",
    vendorId: 1,
    ejectMode: "aandc",
    ejPath: "",
    eventsExclude: "",
    imageFilter: "",
    imagePath: "",
    remoteIp: "",
    remotePort: "",
    vendorConfigName: "",
    wniServiceTimeout: 10,
  });

  const vendorId = history.location.state;
  const updateOrCreate = vendorId !== undefined ? "Update" : "Create";

  useEffect(() => {
    if (vendorId !== undefined)
      dispatch(
        VendorConfigStore.actionCreators.getVendorConfig(parseInt(String(vendorId).toString()))
      );
  }, [vendorId, dispatch]);

  const onDetailFetch = useCallback(() => {
    if (detail?.data) {
      setVendorConfig(detail.data);
    }
  }, [detail, setVendorConfig]);

  useEffect(() => {
    if (detail) onDetailFetch();
  }, [detail, onDetailFetch]);

  // need to change this
  const onCreateMessage = useCallback(() => {
    if (isAdded) {
      addToast(
        `Vendor configuration successfully ${vendorId !== undefined ? "updated" : "created"}!`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    } else {
      addToast(`Failed to ${vendorId !== undefined ? "update" : "create"} vendor configuration!`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_CREATED", payload: false });
  }, [isAdded, dispatch, addToast]);

  useEffect(() => {
    if (!loading && isClicked) {
      onCreateMessage();
      setIsClicked(false);
    }
  }, [loading, isClicked, onCreateMessage, setIsClicked]);

  const [canAddEdit, setCanAddEdit] = useState(false);

  useEffect(() => {
    if (rolePrivilege) {
      if (vendorId !== undefined) setCanAddEdit(!rolePrivilege.edit);
      else setCanAddEdit(!rolePrivilege.add);
    }
  }, [rolePrivilege, vendorId, setCanAddEdit]);

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
                  <i className="mdi mdi-cogs text-info mr-1" />
                  Vendor Configuration
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
                    View Vendor Configuration
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
                    <i className="mdi mdi-cogs text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Vendor Configuration</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Formik
                enableReinitialize={true}
                initialValues={vendorConfig}
                validate={(values) => {
                  const errors = {} as Error;
                  if (!values.vendorConfigName)
                    errors.vendorConfigName = "Please configuration name is required!";

                  if (!values.imageFilter)
                    errors.imageFilter = "Please enter a valid file extension!";

                  if (!values.imagePath)
                    errors.imagePath = "Please image monitoring path is required!";

                  if (!values.atmLogPath) errors.atmLogPath = "Please ATM file path is required!";

                  if (!values.atmLogFilter)
                    errors.atmLogFilter = "Please enter a valid file name extension";

                  if (!values.ejPath) errors.ejPath = "Please electronic journal path is required";

                  if (!values.ejFilter)
                    errors.ejFilter = "Please enter a valid file name extension";
                  return errors;
                }}
                onSubmit={(values) => {
                  if (vendorId) dispatch(VendorConfigStore.actionCreators.addVendorConfig(values));
                  else dispatch(VendorConfigStore.actionCreators.updateVendorConfig(values));
                  setIsClicked((isClicked) => !isClicked);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit}>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                      <Row className="justify-content-between">
                        <Col sm={3}>
                          <Nav variant="pills" className="flex-column rounded-0">
                            <Nav.Item>
                              <Nav.Link className="rounded-0" eventKey="first">
                                <i className="mdi mdi-selection-marker mr-2" />
                                Vendor Selection
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
                                Image Events Exclusion
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        <Col sm={9}>
                          <Tab.Content>
                            <Tab.Pane eventKey="first">
                              <VendorSelection
                                applicationId={formik.values.appId}
                                configurationName={formik.values.vendorConfigName}
                                vendor={formik.values.vendorId}
                                onChange={formik.handleChange}
                                errors={formik.errors}
                                touched={formik.touched}
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                              <Settings
                                atmLogFilter={formik.values.atmLogFilter}
                                atmLogPath={formik.values.atmLogPath}
                                ejFilter={formik.values.ejFilter}
                                ejMode={formik.values.ejectMode}
                                ejPath={formik.values.ejPath}
                                errors={formik.errors}
                                imageFilter={formik.values.imageFilter}
                                imagePath={formik.values.imagePath}
                                onChange={formik.handleChange}
                                remoteIp={formik.values.remoteIp}
                                remotePort={formik.values.remotePort}
                                touched={formik.touched}
                                wniServiceTimeout={formik.values.wniServiceTimeout}
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="third">
                              <ImageEventsExclusion
                                onChange={formik.handleChange}
                                eventsExclude={formik.values.eventsExclude}
                              />
                            </Tab.Pane>
                            <Row>
                              <Col className="mt-1">
                                <Button
                                  className="rounded-0"
                                  type="submit"
                                  disabled={canAddEdit}
                                  size="sm"
                                  variant="outline-success"
                                >
                                  {updateOrCreate}
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
                            </Row>
                          </Tab.Content>
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

export default VendorConfiguration;

import React, { useRef } from "react";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { Col, Row, Card, Form, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";

import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import AccessRightTable from "../../components/AccessRight/AccessRightTable";
import { IAccessRight } from "../../../Dtos/IAccessRight";
import { isEmpty } from "../../../utils/isEmpty";

const AccessRight = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const roles = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.rolesPrivileges
  );

  const privileges = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.privileges
  );

  const accessRight = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.accessRight
  );

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.roles?.loading);

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("roleprivilege"));
    setUserPrivilegeLoading(true);
  }, [dispatch, setUserPrivilegeLoading]);

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

  const componentRef = useRef<HTMLTableElement>(null);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const [state, setState] = useState({
    roleId: 0,
    accessRight: [] as IAccessRight[],
    privilegeId: 0,
    resultPerPage: 10,
  });

  const onChangeHandle = (event: ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = parseInt(event.target.value);

    if (id === "role") {
      if (value === 0) {
        setState({ ...state, privilegeId: value, roleId: value });
      } else {
        setState({ ...state, roleId: value });
      }
    }

    if (id === "privilege") setState({ ...state, privilegeId: value });
  };

  const setAccessRight = useCallback(() => {
    if (accessRight) setState({ ...state, accessRight });
  }, [accessRight, setState]);

  const filtereAccessRight = useCallback(() => {
    let currentAccessRight;

    if (state.roleId === 0 && state.privilegeId === 0) {
      currentAccessRight = accessRight;
    } else if (state.roleId > 0 && state.privilegeId === 0) {
      currentAccessRight = accessRight?.filter((ar) => ar.roleId === state.roleId);
    } else if (state.roleId === 0 && state.privilegeId > 0) {
      currentAccessRight = accessRight?.filter((ar) => ar.privilegeId === state.privilegeId);
    } else if (state.roleId > 0 && state.privilegeId > 0) {
      currentAccessRight = accessRight?.filter(
        (ar) => ar.privilegeId === state.privilegeId && ar.roleId === state.roleId
      );
    }

    if (currentAccessRight !== undefined) setState({ ...state, accessRight: currentAccessRight });
  }, [accessRight, state]);

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getRoles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getPrivileges());
  }, [dispatch]);

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getAccessRights());
  }, [dispatch]);

  useEffect(() => {
    setAccessRight();
  }, [accessRight, setAccessRight]);

  useEffect(() => {
    filtereAccessRight();
  }, [state.roleId, state.privilegeId]);

  const onCheckBoxHandle = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const name = event.target.name;
    if (name === "add") {
      state.accessRight[index].add = !state.accessRight[index].add;
      setState({ ...state });
    }

    if (name === "edit") {
      state.accessRight[index].update = !state.accessRight[index].update;
      setState({ ...state });
    }

    if (name === "view") {
      state.accessRight[index].view = !state.accessRight[index].view;
      setState({ ...state });
    }
  };

  const [isUpdateClicked, setisUpdateClicked] = useState(false);

  const onUpdateClicked = () => {
    setisUpdateClicked(true);
    dispatch(RoleStore.actionCreators.updateAccessRights(state.accessRight));
  };

  const response = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.updateResponse
  );

  useEffect(() => {
    if (!loading && isUpdateClicked) {
      if (response) {
        addToast("Successfully updated!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Failed to update access rights!", {
          appearance: "error",
          autoDismiss: true,
        });
      }

      setisUpdateClicked(false);
      dispatch({ type: "SET_UPDATED", payload: false });
    }
  }, [loading, response, dispatch]);

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.isDownload
  );

  const onExportClickHandler = () => {
    dispatch(RoleStore.actionCreators.export());
  };

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-account-key text-info mr-1" />
                  Role Management
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-access-point text-info mr-1" />
                  Access Rights
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
              <Row className="justify-content-between">
                <Col sm={2}>
                  <div className="float-left">
                    <i className="mdi mdi-access-point text-success icon-sm mr-2" />
                    <h5 className="d-inline">Access Rights</h5>
                  </div>
                </Col>
                <Col sm="auto">
                  <span onClick={onExportClickHandler} role="button" className="mr-3">
                    <i className="mdi mdi-file-export icon-sm" />
                    Export
                    {isDownloading ? (
                      <Spinner className="ml-2" animation="border" size="sm" variant="success" />
                    ) : null}
                  </span>
                  <span onClick={handlePrint} role="button">
                    <i className="mdi mdi-printer text-success icon-sm" />
                    Print
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Form as={Col} md={8} inline>
                  <Form.Label className="mr-2">Role</Form.Label>
                  <Form.Group controlId="role">
                    <Form.Control
                      className="mr-5 rounded-0"
                      onChange={onChangeHandle}
                      value={state.roleId}
                      as="select"
                      custom
                    >
                      <option value={0}>Select</option>
                      {roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.rolename}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Label className="mr-2">Privilege</Form.Label>
                  <Form.Group controlId="privilege">
                    <Form.Control
                      className="rounded-0"
                      onChange={onChangeHandle}
                      value={state.privilegeId}
                      as="select"
                      custom
                    >
                      <option value={0}>Select</option>
                      {privileges?.map((privilege) => (
                        <option key={privilege.id} value={privilege.id}>
                          {privilege.privilege}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Button
                    as={Col}
                    sm="auto"
                    size="sm"
                    onClick={onUpdateClicked}
                    variant="outline-dark"
                    className="ml-5 align-middle rounded-0"
                  >
                    <i className="mdi mdi-update align-middle" />
                    <span className="align-middle px-1"> Update</span>
                  </Button>
                </Form>
              </Row>
              <Row>
                <Col sm="auto" className=" mt-3">
                  <h4>Total: {loading ? 0 : state.accessRight.length}</h4>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-5">
                  <Col sm="auto">
                    <Spinner animation="grow" variant="success" />
                  </Col>
                </Row>
              ) : (
                <Row className="mt-1">
                  <AccessRightTable
                    ref={componentRef}
                    onCheckBoxHandle={onCheckBoxHandle}
                    tableData={state.accessRight}
                  />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default AccessRight;

import React, { useState, ChangeEvent, useEffect, FormEvent, useCallback } from "react";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";

import * as AuthenticationStore from "../../../store/AuthenticationStore";
import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import * as UserStore from "../../../store/UsersStore";
import { useSelector, useDispatch } from "react-redux";
import { IUser } from "../../../Dtos/IUsers";
import { isEmpty } from "../../../utils/isEmpty";

const EditUser = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("edituser"));
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
  }, [userPrivilegeLoading, unAuthorizedPage]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const user = useSelector((state: ApplicationStore.ApplicationState) => state.users?.user);

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.users?.loading);

  const [state, setState] = useState<IUser>({} as IUser);

  const roles = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.rolesPrivileges
  );

  const response = useSelector(
    (state: ApplicationStore.ApplicationState) => state.users?.updateResponse
  );

  const userId = history.location.state;

  const onChangeHandle = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.id === "formHorizontalRole")
      setState({ ...state, roleId: parseInt(event.target.value) });

    if (event.target.id === "formHorizontalStatus")
      setState({
        ...state,
        status: event.target.value.toLowerCase() === "true" ? true : false,
      });
  };

  const onSubmitHandle = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    console.log(state);
    dispatch(UserStore.actionCreators.postEdit(state));
  };

  const setUser = useCallback(() => {
    if (user) {
      setState(user.data);
    }
  }, [user, setState]);

  useEffect(() => {
    if (userId === undefined) {
      history.push("/user/viewuser");
    } else {
      dispatch(UserStore.actionCreators.getUser(parseInt(String(userId).toString())));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getRoles());
  }, [dispatch]);

  useEffect(() => {
    setUser();
  }, [user, setUser]);

  useEffect(() => {
    if (!loading && !isEmpty(response)) {
      if (response?.data) {
        addToast("User succesfully updated!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Failed to update user!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      dispatch({ type: "CLEAR_UPDATE_RESPONSE" });
    }
  }, [loading, response, dispatch, addToast]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-account-network text-info mr-1" />
                  User Management
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="!#"
                    onClick={(event) => {
                      event.preventDefault();
                      history.push("/user/viewuser");
                    }}
                  >
                    <i className="mdi mdi-account-search text-info mr-1" />
                    View User
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-account-edit text-info mr-1" />
                  User Details
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
              <i className="mdi mdi-account-edit text-success icon-sm mr-2" />
              User Details
            </Card.Header>
            <Card.Body>
              <Col sm={9}>
                <Form as={Row}>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      disabled
                      value={state?.userName || ""}
                      placeholder="Username"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalFullname">
                    <Form.Label>Fullname</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      disabled
                      value={state?.fullName || ""}
                      type="text"
                      placeholder="Fullname"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      onChange={onChangeHandle}
                      value={state?.roleId || ""}
                      as="select"
                      custom
                    >
                      {roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.rolename}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      onChange={onChangeHandle}
                      value={String(state?.status) || ""}
                      as="select"
                      custom
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      disabled
                      value={state?.email || ""}
                      type="email"
                      placeholder="Email"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalCreateBy">
                    <Form.Label>Created By</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      disabled
                      value={state?.createdBy || ""}
                      type="text"
                      placeholder="Created By"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalCreatedDate">
                    <Form.Label>Created Date</Form.Label>
                    <Form.Control
                      disabled
                      value={state?.createdDate || ""}
                      type="datetime"
                      placeholder="Created Date"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalApprovedBy">
                    <Form.Label>Approved By</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      disabled
                      value={state?.approvedBy || ""}
                      type="text"
                      placeholder="Approved By"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6} controlId="formHorizontalApprovedDate">
                    <Form.Label>Approved Date</Form.Label>
                    <Form.Control
                      size="lg"
                      className="rounded-0"
                      value={state?.approvedDate || ""}
                      disabled
                      type="datetime"
                      placeholder="Approved Date"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={6}>
                    <Form.Label>Approved</Form.Label>
                    <Form.Check
                      custom
                      readOnly
                      type="checkbox"
                      checked={state?.approved || false}
                      label=""
                    />
                  </Form.Group>
                  <Col sm="auto">
                    <Button
                      size="sm"
                      disabled={loading}
                      onClick={() => history.push("/user/viewuser")}
                      type="submit"
                      className="mt-2 rounded-0"
                      variant="outline-success"
                    >
                      <span className="align-middl">
                        <i className="mdi mdi-backburger " />
                      </span>
                    </Button>
                  </Col>
                  <Col sm="auto">
                    <Button
                      size="sm"
                      disabled={loading}
                      type="submit"
                      className="mt-2 rounded-0"
                      onClick={onSubmitHandle}
                      variant="outline-success"
                    >
                      <span className="align-middle px-1">Update</span>
                      {loading ? (
                        <Spinner
                          className="align-middle"
                          as="span"
                          size="sm"
                          animation="border"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Button>
                  </Col>
                </Form>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default EditUser;

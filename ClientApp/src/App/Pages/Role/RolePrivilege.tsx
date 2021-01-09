import React, { useState, useCallback, useEffect } from "react";
import { Row, Col, Tab, Card, Nav } from "react-bootstrap";
import { useHistory } from "react-router";

import AddMultiPrivileges from "./AddMultiPrivileges";
import ViewRolePrivileges from "./ViewRolePrivileges";
import AddRolePrivilege from "./AddRolePrivilege";
import * as ApplicationStore from "../../../store/index";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "../../../utils/isEmpty";

const RolePrivilege = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [key, setKey] = useState("first");

  const onSelectHandle = (key: string | null) => {
    if (key !== null) setKey(key);
  };

  const [role, setRole] = useState(1);
  const [privilege, setPrivilege] = useState(1);
  const [isEdit, setIsEdit] = useState(false);

  const onEditClickHandle = (privilegeId: number, roleId: number) => {
    // roleId is different so 1 must be added
    setRole(roleId + 1);
    setPrivilege(privilegeId);
    setIsEdit(true);
    onSelectHandle("second");
  };

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("roleprivilege"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const user = useSelector((state: ApplicationStore.ApplicationState) => state.auth?.user);

  const showMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      history.push("/unauthorized");
    }
  }, [userPrivilegeLoading, unAuthorizedPage]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const [canEdit, setCanEdit] = useState(false);
  const [canAdd, setCanAdd] = useState(false);

  useEffect(() => {
    if (user && user.role.toLowerCase() !== "system administrator") {
      if (rolePrivilege) {
        setCanAdd(!rolePrivilege.add);
        setCanEdit(!rolePrivilege.edit);
      }
    }
  }, [user, rolePrivilege, setCanAdd, setCanEdit]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-account-key text-info mr-1" />
                  Role
                </li>
                <li className="breadcrumb-item">
                  <i className="mdi mdi-cogs text-info mr-1" />
                  Role Privilege
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header className="container-fluid bg-white">
              <Row>
                <Col>
                  <div className="float-left">
                    <i className="mdi mdi-cogs text-success icon-sm mr-2" />
                    <h5 className="d-inline">Role Privilege</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Tab.Container id="left-tabs-example" activeKey={key} onSelect={onSelectHandle}>
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column rounded-0">
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="first">
                          <i className="mdi mdi-plus-box-multiple mr-2" />
                          Add MultiPrivileges
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="second">
                          <i className="mdi mdi-plus-box mr-2" />
                          Add Role Privilege
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="third">
                          <i className="mdi mdi-view-array mr-2" />
                          View Role Privileges
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <AddMultiPrivileges canAdd={canAdd} />
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <AddRolePrivilege
                          isEdit={isEdit}
                          canEdit={canEdit}
                          canAdd={canAdd}
                          role={role}
                          setRole={setRole}
                          privilege={privilege}
                          setPrivilege={setPrivilege}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        <ViewRolePrivileges canEdit={canEdit} onEditClick={onEditClickHandle} />
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};
export default RolePrivilege;

import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Tab, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import * as AuthenticationStore from "../../../store/AuthenticationStore";
import * as ApplicationStore from "../../../store/index";
import AddBranchByCsv from "../../components/Branch/AddBranch/AddBranchByCsv";
import AddOrEditBranch from "../../components/Branch/AddBranch/AddOrEditBranch";
import { isEmpty } from "../../../utils/isEmpty";

const AddBranch = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("addbranch"));
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
  }, [userPrivilegeLoading, unAuthorizedPage, rolePrivilege, history]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-source-branch text-info mr-1" />
                  Branch
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-source-branch-plus text-info mr-1" />
                  Add Branch
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
                    <i className="mdi mdi-source-branch-plus text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Add Branch</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Tab.Container id="add-branch-tabs" defaultActiveKey="first">
                <Row>
                  <Col sm={2}>
                    <Nav variant="pills" className="flex-column rounded-0">
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="first">
                          <i className="mdi mdi-source-branch-plus mr-2" />
                          Add Branch
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="second">
                          <i className="mdi mdi-source-branch-sync mr-2" />
                          Add Branches By CSV
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={10}>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <Col>
                          <AddOrEditBranch />
                        </Col>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <AddBranchByCsv />
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

export default AddBranch;

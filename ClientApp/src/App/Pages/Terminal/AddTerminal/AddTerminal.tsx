import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Tab, Card, Nav } from "react-bootstrap";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import AddAtm from "./AddAtm";
import AddWithCsv from "./AddWithCsv";
import * as ApplicationStore from "../../../../store";
import * as AuthenticationStore from "../../../../store/AuthenticationStore";
import { isEmpty } from "../../../../utils/isEmpty";

const AddTerminal = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("addterminal"));
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
                  <i className="mdi mdi-console-network text-info mr-1" />
                  Terminal
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-plus-network-outline text-info mr-1" />
                  Add Terminal
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
                    <i className="mdi mdi-plus-network-outline text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Add Terminal</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Tab.Container id="add-terminal-tabs" defaultActiveKey="first">
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column rounded-0">
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="first">
                          <i className="mdi mdi-plus-network-outline  mr-2" />
                          Add ATM
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link className="rounded-0" eventKey="second">
                          <i className="mdi mdi-clipboard-list-outline mr-2" />
                          Add ATM using CSV
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <Col>
                          <AddAtm />
                        </Col>
                      </Tab.Pane>
                      <Tab.Pane eventKey="second">
                        <AddWithCsv />
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

export default AddTerminal;

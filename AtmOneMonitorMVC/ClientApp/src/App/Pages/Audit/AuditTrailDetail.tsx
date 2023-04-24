import React, { useState, useEffect, useCallback } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { IAuditTrailDetail } from "../../../Dtos/IAuditTrail";
import * as ApplicationStore from "../../../store/index";
import * as AuditTrailStore from "../../../store/AuditTrailStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import { isEmpty } from "../../../utils/isEmpty";

const AuditTrailDetail = () => {
  const [state, setState] = useState<IAuditTrailDetail>({
    action: "",
    activity: "",
    auditId: 0,
    logDate: "",
    newValues: "",
    oldValues: "",
    privilegeId: 0,
    sysIp: "",
    sysName: "",
    userId: 0,
    userName: "",
  });

  const auditTrailDetail = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auditTrail?.auditTrail
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("viewaudittrail"));
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

  const auditId = history.location.state;

  useEffect(() => {
    if (auditId) {
      dispatch(
        AuditTrailStore.actionCreators.getAuditTrailDetail(parseInt(String(auditId).toString()))
      );
    } else {
      history.push("/dashboard");
    }
  }, [auditId, dispatch, history]);

  const setAuditTrailState = useCallback(() => {
    if (auditTrailDetail) setState(auditTrailDetail.data);
  }, [auditTrailDetail, setState]);

  useEffect(() => {
    setAuditTrailState();
  }, [auditTrailDetail, setAuditTrailState]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-account-search-outline text-info mr-1" />
                  Audit Trail
                </li>
                <li className="breadcrumb-item">
                  <i className="mdi mdi-badge-account-outline text-info icon-sm mr-1" />
                  Audit Trail Detail
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="rounded-0">
            <Card.Header className="container-fluid bg-white ">
              <div>
                <i className="mdi mdi-badge-account-outline text-success icon-sm mr-1" />
                <h5 className="d-inline">Audit Trail Detail</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className=" mt-3">
                <Col sm={9}>
                  <Form as={Row} className="justify-content-between">
                    <Form.Group as={Col} sm={5} controlId="formHorizontalUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        disabled
                        value={state?.userName}
                        placeholder="Username"
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={5} controlId="formHorizontalActivity">
                      <Form.Label>Activity</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        disabled
                        value={state?.activity}
                        placeholder="Activity"
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={5} controlId="formHorizontalAction">
                      <Form.Label>Action</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        disabled
                        value={state?.action}
                        placeholder="Action"
                      />
                    </Form.Group>

                    <Form.Group as={Col} sm={5} controlId="formHorizontalSysIp">
                      <Form.Label>System IP</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        disabled
                        value={state?.sysIp}
                        placeholder="System IP"
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} controlId="formHorizontalOldValues">
                      <Form.Label>Old Values</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        as="textarea"
                        disabled
                        value={state?.oldValues}
                        rows={10}
                        placeholder="Old Values"
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={12} controlId="formHorizontalNewValues">
                      <Form.Label>New Values</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        as="textarea"
                        disabled
                        rows={10}
                        value={state?.newValues}
                        placeholder="New Values"
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={5} controlId="formHorizontalActionDate">
                      <Form.Label>Action Date</Form.Label>
                      <Form.Control
                        size="lg"
                        className="rounded-0"
                        type="datetime"
                        disabled
                        value={new Date(state?.logDate).toLocaleString()}
                        placeholder="Action Date"
                      />
                    </Form.Group>
                    <Col className="align-self-center">
                      <Button
                        className="rounded-0"
                        as={Col}
                        sm={3}
                        block
                        size="lg"
                        onClick={() => history.push("/audittrail")}
                        variant="outline-success"
                      >
                        Go Back
                      </Button>
                    </Col>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default AuditTrailDetail;

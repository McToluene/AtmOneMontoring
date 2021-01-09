import React, { useEffect, useCallback, useState, ChangeEvent } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import AuditTrailTable from "../../components/AuditTrail/AuditTrailTable";
import * as AuditTrailStore from "../../../store/AuditTrailStore";
import * as ApplicationStore from "../../../store";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import IAuditFilter from "../../../Dtos/IAuditFilter";
import { isEmpty } from "../../../utils/isEmpty";
import DateFilter from "../../components/Terminal/ConnectedTerminal/DateFilter";

export default function AuditTrail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userId, setUserId] = useState(0);
  const [privilegeId, setPrivilegeId] = useState(0);
  const [disableDateFilter, setDisableDateFilter] = useState(false);

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("audittrail"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const onDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { id, value } = event.target;
    switch (id) {
      case "date-from":
        setDateFrom(value);
        break;
      case "date-to":
        setDateTo(value);
        break;
    }
  };

  const showMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      history.push("/unauthorized");
    }
  }, [userPrivilegeLoading, unAuthorizedPage]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const onExportClickHandler = () => {
    const terminalConfig: IAuditFilter = {
      dateFrom,
      dateTo,
      userId,
      privilegeId,
    };
    dispatch(AuditTrailStore.actionCreators.export(terminalConfig));
  };

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-account-search-outline text-info mr-2" />
                  Audit Trail
                </li>
              </ol>
            </nav>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a
                    href="!#"
                    onClick={(event) => {
                      event.preventDefault();
                      history.push("/dashboard/camera");
                    }}
                  >
                    <i className="mdi mdi mdi-camera-burst text-info mr-2" />
                    Camera monitor
                  </a>
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <DateFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateChange={onDateChange}
          disable={disableDateFilter}
        />
      </Row>
      <Row>
        <Col>
          <Card className="rounded-0">
            <Card.Header className="container-fluid bg-white">
              <Row className="justify-content-between">
                <Col sm={2}>
                  <div className="float-left">
                    <i className="mdi mdi-account-search-outline text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Audit Trail</h5>
                  </div>
                </Col>
                <Col sm="auto">
                  <span onClick={onExportClickHandler} role="button" className="mr-3">
                    <i className="mdi mdi-file-export icon-sm"></i>
                    Export
                  </span>
                  <span role="button">
                    <i className="mdi mdi-printer text-success icon-sm" />
                    Print
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <AuditTrailTable
                setDisableDateFilter={setDisableDateFilter}
                dateFrom={dateFrom}
                dateTo={dateTo}
                privilegeId={privilegeId}
                setPrivilegeId={setPrivilegeId}
                setUserId={setUserId}
                userId={userId}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}

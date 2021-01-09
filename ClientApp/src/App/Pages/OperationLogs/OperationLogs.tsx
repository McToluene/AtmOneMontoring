import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useReactToPrint } from "react-to-print";

import { Col, Row, Card, Spinner } from "react-bootstrap";
import OperationLogTable from "../../components/OperationLogs/OperationLogTable";
import * as OperationLogStore from "../../../store/OperationLogsStore";
import * as ApplicationStore from "../../../store/index";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";
import { isEmpty } from "../../../utils/isEmpty";

const OperationLogs = () => {
  const [allowPaging, setAllowPaging] = useState(true);
  const dispatch = useDispatch();
  const history = useHistory();

  const componentRef = useRef<HTMLTableElement>(null);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("viewlog"));
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

  const [item, setItem] = useState("");
  const [value, setValue] = useState("");

  const onExportClickHandler = () => {
    const logsFilter: IItemValueFilter = {
      item,
      value,
    };
    dispatch(OperationLogStore.actionCreators.export(logsFilter));
  };

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.operationLog?.isDownload
  );

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-card-bulleted-outline text-info mr-1" />
                  Logs
                </li>
                <li className="breadcrumb-item">
                  <i className="mdi mdi-camera-rear text-info mr-1" />
                  Access Log
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
                      history.push("/logs/blurredcameras");
                    }}
                  >
                    <i className="mdi mdi-webcam text-info mr-1" />
                    View Blurred
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="!#"
                    onClick={(event) => {
                      event.preventDefault();
                      history.push("/dashboard/camera");
                    }}
                  >
                    <i className="mdi mdi-format-align-center text-info mr-1" />
                    Camera monitor
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
              <Row className="justify-content-between">
                <Col sm={3} md={3}>
                  <div className="float-left">
                    <i className="mdi mdi-camera-rear text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Atm Intelligent Camera [Access Logs]</h5>
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
              <OperationLogTable
                ref={componentRef}
                item={item}
                setItem={setItem}
                setValue={setValue}
                value={value}
                allowPaging={allowPaging}
                setAllowPaging={setAllowPaging}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default OperationLogs;

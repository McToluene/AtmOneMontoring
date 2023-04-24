import React, { useState, ChangeEvent, useEffect, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router";
import { Spinner, Col, Row, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import * as ApplicationStore from "../../../store/index";
import * as BlurredCameraStore from "../../../store/BlurredCameraStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import { IBlurredTerminal } from "../../../Dtos/ITerminal";
import { IDateItemValueFilter } from "../../../Dtos/IDateItemValueFilter";
import TableTop from "../../components/Common/CustomTableTop";
import DateFilter from "../../components/Terminal/ConnectedTerminal/DateFilter";
import BlurredCameraTable from "../../components/BlurredCamera/BlurredCameraTable";

import { isEmpty } from "../../../utils/isEmpty";
import { IOnPageChangedData } from "../../components/Pagination/Pagination";

const BlurredCamera = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const [disableSearch, setDisableSearch] = useState(false);
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [terminals, setTerminals] = useState<IBlurredTerminal[]>([]);
  const [currentTerminals, setCurrentTerminals] = useState<IBlurredTerminal[]>([]);
  const [tableContent, setTableContent] = useState<IBlurredTerminal[]>([]);

  const componentRef = useRef<HTMLTableElement>(null);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("viewblockedcamera"));
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
  }, [userPrivilegeLoading, unAuthorizedPage, rolePrivilege, setUserPrivilegeLoading]);

  useEffect(() => {
    showMessage();
  }, [showMessage]);

  const globalTerminals = useSelector(
    (state: ApplicationStore.ApplicationState) => state.blurred?.cameras
  );

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.blurred?.loading);

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

  const onTerminals = useCallback(() => {
    if (globalTerminals?.data) {
      setTerminals(globalTerminals.data);
    }
  }, [globalTerminals, setTerminals]);

  useEffect(() => {
    onTerminals();
  }, [onTerminals]);

  const fetchHandler = useCallback(
    (item: string, value: string, dateFrom: string, dateTo: string) => {
      const terminalFilter: IDateItemValueFilter = {
        item,
        value,
        dateFrom,
        dateTo,
      };
      dispatch(BlurredCameraStore.actionCreators.getBlurredCameras(terminalFilter));
    },
    [dispatch]
  );

  const terminalId = history.location.state;

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentTerminals = terminals?.slice(offSet, offSet + pageLimit);
    currentTerminals = currentTerminals ? currentTerminals : [];
    setCurrentTerminals(currentTerminals);
  };

  const onRefreshClickHandler = () => {
    setDateFrom("");
    setDateTo("");
    setValue("");
    setItem("");
  };

  useEffect(() => {
    if (allowPaging) setTableContent(currentTerminals);
    else setTableContent(terminals);
  }, [allowPaging, setTableContent, terminals, currentTerminals]);

  useEffect(() => {
    if (terminalId !== undefined) {
      fetchHandler("Terminal ID", String(terminalId), "", "");
      setDisableSearch(true);
    } else fetchHandler(item, value, dateFrom, dateTo);
  }, [terminalId, fetchHandler, value, dateTo]);

  const onExportClickHandler = () => {
    const branchFilter: IDateItemValueFilter = {
      item,
      value,
      dateFrom,
      dateTo,
    };
    dispatch(BlurredCameraStore.actionCreators.export(branchFilter));
  };

  const items = ["IP", "Terminal ID"];

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isDownload
  );

  useEffect(() => {
    return () => {
      history.location.state = undefined;
    };
  }, []);

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
                  <i className="mdi mdi-webcam text-info mr-1" />
                  Blurred Camera
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
        <DateFilter dateFrom={dateFrom} dateTo={dateTo} onDateChange={onDateChange} />
      </Row>
      <Row>
        <Col>
          <Card className="rounded-0">
            <Card.Header className="container-fluid bg-white">
              <Row className="justify-content-between">
                <Col sm={2}>
                  <div className="float-left">
                    <i className="mdi mdi-webcam text-success icon-sm mr-2" />
                    <h5 className="d-inline">Blurred Camera</h5>
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
              <TableTop
                handlePageChanged={handlePageChanged}
                items={items}
                onRefreshClickHandler={onRefreshClickHandler}
                item={item}
                setItem={setItem}
                setValue={setValue}
                value={value}
                allowPaging={allowPaging}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setAllowPaging={setAllowPaging}
                disable={disableSearch}
                totalRecords={terminals?.length}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {loading ? 0 : terminals?.length}</h4>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-3">
                  <Col sm="auto">
                    <Spinner animation="grow" size="sm" variant="success" />
                  </Col>
                </Row>
              ) : (
                <BlurredCameraTable cameras={tableContent} ref={componentRef} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default BlurredCamera;

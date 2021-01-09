import React, { useState, ChangeEvent, useCallback, useEffect, useRef } from "react";
import { Col, Row, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router";

import DateFilter from "../../../components/Terminal/ConnectedTerminal/DateFilter";
import * as ApplicationStore from "../../../../store/index";
import * as OnlineStore from "../../../../store/OnlineTerminalsStore";
import * as AuthenticationStore from "../../../../store/AuthenticationStore";
import { IDateItemValueFilter } from "../../../../Dtos/IDateItemValueFilter";
import TableTop from "../../../components/Common/CustomTableTop";
import ConnectedTerminalTable from "../../../components/Terminal/ConnectedTerminal/ConnectedTerminalTable";
import { IOnlineTerminal } from "../../../../Dtos/ITerminal";
import { isEmpty } from "../../../../utils/isEmpty";
import { IOnPageChangedData } from "../../../components/Pagination/Pagination";

const ConnectedTerminals = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const componentRef = useRef<HTMLTableElement>(null);
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [terminals, setTerminals] = useState<IOnlineTerminal[]>([]);
  const [currentTerminals, setCurrentTerminals] = useState<IOnlineTerminal[]>([]);
  const [tableContent, setTableContent] = useState<IOnlineTerminal[]>([]);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("connectedterminal"));
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

  const globalOnlineTerminals = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.onlineTerminals
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.loading
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

  const onTerminals = useCallback(() => {
    if (globalOnlineTerminals?.data) {
      setTerminals(globalOnlineTerminals.data);
    }
  }, [globalOnlineTerminals, setTerminals]);

  useEffect(() => {
    onTerminals();
  }, [globalOnlineTerminals, onTerminals]);

  const fetchHandler = useCallback(
    (item: string, value: string, dateFrom: string, dateTo: string) => {
      const terminalFilter: IDateItemValueFilter = {
        item,
        value,
        dateFrom,
        dateTo,
      };
      dispatch(OnlineStore.actionCreators.getOnlineTerminals(terminalFilter));
    },
    [dispatch]
  );

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
    fetchHandler(item, value, dateFrom, dateTo);
  }, [pageSize, fetchHandler, dateFrom, dateTo, value]);

  useEffect(() => {
    if (allowPaging) setTableContent(currentTerminals);
    else setTableContent(terminals);
  }, [allowPaging, setTableContent, terminals, currentTerminals]);

  const onExportClickHandler = () => {
    const terminalFilter: IDateItemValueFilter = {
      item,
      value,
      dateFrom,
      dateTo,
    };
    dispatch(OnlineStore.actionCreators.export(terminalFilter));
  };

  const items = ["IP", "Terminal ID", "Vendor"];

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.isDownload
  );

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
                  <i className="mdi mdi-lan-connect text-info mr-1" />
                  Connected Terminals
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
                    <i className="mdi mdi-lan-connect text-success icon-sm mr-2" />
                    <h5 className="d-inline">Connected Terminals</h5>
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
                allowPaging={allowPaging}
                handlePageChanged={handlePageChanged}
                item={item}
                items={items}
                onRefreshClickHandler={onRefreshClickHandler}
                setItem={setItem}
                setValue={setValue}
                value={value}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setAllowPaging={setAllowPaging}
                totalRecords={terminals.length}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {terminals?.length}</h4>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-5">
                  <Col sm="auto">
                    <Spinner animation="grow" variant="success" />
                  </Col>
                </Row>
              ) : (
                <ConnectedTerminalTable onlineTerminals={tableContent} ref={componentRef} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ConnectedTerminals;

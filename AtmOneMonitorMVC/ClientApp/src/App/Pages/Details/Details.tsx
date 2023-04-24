import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useReactToPrint } from "react-to-print";
import IIssue from "../../../Dtos/IIssue";

import * as ApplicationStore from "../../../store/index";
import * as DetailsStore from "../../../store/DetailsStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import { isEmpty } from "../../../utils/isEmpty";
import { IIssueFilter, ISelectedIIssueFilter } from "../../../Dtos/IIssueFilter";
import { IOnPageChangedData } from "../../components/Pagination/Pagination";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import DetailsSearch from "../../components/Details/DetailsSearch";
import DetailsTable from "../../components/Details/DetailsTable";
import TableTop from "../../components/Common/CustomTableTop";

const Detail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLTableElement>(null);
  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);
  const [range, setRange] = useState(1);
  const [applicationId, setApplicationId] = useState("IC");
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [currentIssues, setCurrentIssues] = useState<IIssue[]>([]);
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [tableContent, setTableContent] = useState<IIssue[]>([]);
  const [disableSearch, setDisableSearch] = useState(false);
  const [enableSwitch, setEnableSwitch] = useState(false);
  const items = ["Status", "Terminal ID", "IP", "Issue", "Incident Date"];

  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const globalIssues = useSelector(
    (state: ApplicationStore.ApplicationState) => state.issue?.issues
  );

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("report"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.issue?.loading);

  const showMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      history.push("/unauthorized");
    }
  }, [userPrivilegeLoading, rolePrivilege, unAuthorizedPage, history, setUserPrivilegeLoading]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const filteringState: any = history.location.state;

  const fetchHandler = useCallback(() => {
    const filter: IIssueFilter = {
      appId: applicationId,
      item,
      range,
      value,
    };

    dispatch(DetailsStore.actionCreators.getIssues(filter));
  }, [dispatch, range, applicationId, value]);

  const fetchFilterHandler = useCallback(
    (appId: string, msgCat: string) => {
      const filter: ISelectedIIssueFilter = {
        appId,
        item,
        range,
        value,
        msgCat,
      };
      dispatch(DetailsStore.actionCreators.getSelectedIssues(filter));
    },
    [dispatch, applicationId, range, value]
  );

  useEffect(() => {
    if (filteringState !== undefined) {
      const appId = String(filteringState?.appId);
      const cat = String(filteringState?.cat);
      if (appId && cat) {
        setEnableSwitch(true);
        setDisableSearch(true);
        if (appId === "IC") {
          setApplicationId("IC");
          fetchFilterHandler("IC", cat);
        }
        if (appId === "EJ") {
          setApplicationId("EJ");
          fetchFilterHandler("EJ", cat);
        }
      }
    } else {
      if (!isEmpty(rolePrivilege) && !unAuthorizedPage) {
        fetchHandler();
      }
    }
  }, [
    filteringState,
    setApplicationId,
    setEnableSwitch,
    fetchFilterHandler,
    isEmpty,
    rolePrivilege,
    unAuthorizedPage,
    fetchHandler,
  ]);

  const onFetch = useCallback(() => {
    if (globalIssues?.data) setIssues(globalIssues.data);
  }, [globalIssues, setIssues]);

  useEffect(() => {
    if (globalIssues) onFetch();
  }, [globalIssues, onFetch]);

  const onExportClickHandler = () => {
    const filter: IIssueFilter = {
      appId: applicationId,
      item,
      range,
      value,
    };
    dispatch(DetailsStore.actionCreators.exportFile(filter));
  };

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.issue?.isDownload
  );

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentIssues = issues?.slice(offSet, offSet + pageLimit);
    currentIssues = currentIssues ? currentIssues : [];
    setCurrentIssues(currentIssues);
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
  };

  useEffect(() => {
    if (allowPaging) setTableContent(currentIssues);
    else setTableContent(issues);
  }, [allowPaging, setTableContent, issues, currentIssues]);

  useEffect(() => {
    return () => {
      history.location.state = undefined;
    };
  }, []);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-home-outline text-info mr-2" />
                  Home
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-format-align-center text-info mr-2" />
                  Details
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="justify-content-center">
          <DetailsSearch
            disable={enableSwitch}
            range={range}
            setRange={setRange}
            applicationId={applicationId}
            setApplicationId={setApplicationId}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Card className="card-statistics rounded-0">
            <Card.Header className="container-fluid bg-white">
              <Row className="justify-content-between">
                <Col sm={2}>
                  <div className="float-left">
                    <i className="mdi mdi-format-align-center text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Terminals With Issues</h5>
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
            <Card.Body className="container-fluid">
              <TableTop
                allowPaging={allowPaging}
                handlePageChanged={handlePageChanged}
                item={item}
                items={items}
                onRefreshClickHandler={onRefreshClickHandler}
                pageSize={pageSize}
                setAllowPaging={setAllowPaging}
                setItem={setItem}
                setPageSize={setPageSize}
                setValue={setValue}
                totalRecords={issues?.length}
                value={value}
                disable={disableSearch}
              />
              <Row className="mt-4">
                <Col sm="auto">
                  <span>
                    Total:
                    <strong className="ml-2">{issues?.length}</strong>
                  </span>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-5">
                  <Col sm="auto">
                    <Spinner animation="grow" size="sm" variant="success" />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <DetailsTable issues={tableContent} ref={componentRef} />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default Detail;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useReactToPrint } from "react-to-print";

import * as DetailsStore from "../../../store/DetailsStore";
import * as ApplicationStore from "../../../store/index";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import IIssue from "../../../Dtos/IIssue";
import DetailsSearch from "../../components/Details/DetailsSearch";
import DetailsTable from "../../components/Details/DetailsTable";
import {
  IIssueFilter,
  IIssuePagingFilter,
  ISelectedIIssueFilter,
  ISelectedIIssuePagingFilter,
} from "../../../Dtos/IIssueFilter";
import TableTop from "../../components/Common/TableTop";
import { ICustomPagingState } from "../../../Dtos/ICustomPagingState";
import { isEmpty } from "../../../utils/isEmpty";

export default function DetailsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLTableElement>(null);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const issues = useSelector((state: ApplicationStore.ApplicationState) => state.issue?.issues);

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("report"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.issue?.loading);

  const showMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      const page = "reports";
      history.push("/unauthorized", page);
    }
  }, [userPrivilegeLoading, rolePrivilege, unAuthorizedPage, history]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const [range, setRange] = useState(1);
  const [applicationId, setApplicationId] = useState("IC");
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);

  const [pagination, setPagination] = useState<ICustomPagingState>({
    firstPage: "",
    lastPage: "",
    nextPage: "",
    pageNumber: 0,
    previousPage: "",
    totalPages: 0,
  });
  const [state, setState] = useState<IIssue[]>([]);

  const fetchHandler = useCallback(() => {
    const filter: IIssueFilter = {
      appId: applicationId,
      item,
      range,
      value,
    };

    dispatch(DetailsStore.actionCreators.getIssues(filter));
  }, [dispatch, applicationId, item, range, value]);

  const fectchWithPagingHandler = useCallback(
    (pageNumber: number, pageSize: number) => {
      const filter: IIssuePagingFilter = {
        appId: applicationId,
        item,
        range,
        value,
        pageNumber,
        pageSize,
      };
      dispatch(DetailsStore.actionCreators.getPaginatedIssues(filter));
    },
    [applicationId, item, range, value, dispatch]
  );

  const filteringState: any = history.location.state;

  const onPageClickHandler = (pageNumber: number) => {
    if (filteringState !== undefined) {
      const appId = String(filteringState?.appId);
      const cat = String(filteringState?.cat);
      if (appId && cat) {
        if (appId === "IC") {
          if (allowPaging) {
            fectchSelectedWithPagingHandler("IC", cat, pageNumber, pageSize);
          } else {
            fetchFilterHandle("IC", cat);
          }
        }

        if (appId === "EJ") {
          if (allowPaging) {
            fectchSelectedWithPagingHandler("EJ", cat, pageNumber, pageSize);
          } else {
            fetchFilterHandle("EJ", cat);
          }
        }
      }
    } else {
      if (allowPaging) fectchWithPagingHandler(pageNumber, pageSize);
      else fetchHandler();
    }
  };

  const onPageSizeChange = (pageSize: number) => {
    if (filteringState !== undefined) {
      const appId = String(filteringState?.appId);
      const cat = String(filteringState?.cat);

      if (appId && cat) {
        if (appId === "IC") {
          fectchSelectedWithPagingHandler("IC", cat, 0, pageSize);
        }

        if (appId === "EJ") {
          fectchSelectedWithPagingHandler("EJ", cat, 0, pageSize);
        }
      }
    } else {
      fectchWithPagingHandler(0, pageSize);
    }
  };

  const onSubmitHandler = (item: string, value: string) => {
    if (filteringState !== undefined) {
      const appId = String(filteringState?.appId);
      const cat = String(filteringState?.cat);

      if (appId && cat) {
        if (appId === "IC") {
          if (allowPaging) {
            fectchSelectedWithPagingHandler("IC", cat, 0, pageSize);
          } else {
            fetchFilterHandle("IC", cat);
          }
        }

        if (appId === "EJ") {
          if (allowPaging) {
            fectchSelectedWithPagingHandler("EJ", cat, 0, pageSize);
          } else {
            fetchFilterHandle("EJ", cat);
          }
        }
      }
    } else {
      if (allowPaging) fectchWithPagingHandler(0, pageSize);
      else fetchHandler();
    }
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
    if (filteringState !== undefined) {
      const appId = String(filteringState?.appId);
      const cat = String(filteringState?.cat);
      if (appId && cat) {
        if (appId === "IC") {
          if (allowPaging) {
            fectchSelectedWithPagingHandler("IC", cat, 0, pageSize);
          } else {
            fetchFilterHandle("IC", cat);
          }
        }

        if (appId === "EJ") {
          if (allowPaging) {
            fectchSelectedWithPagingHandler("EJ", cat, 0, pageSize);
          } else {
            fetchFilterHandle("EJ", cat);
          }
        }
      }
    } else {
      if (allowPaging) fectchWithPagingHandler(0, pageSize);
      else fetchHandler();
    }
  };

  const setIssues = useCallback(() => {
    if (issues?.data) {
      setState(issues.data);
      // setPagination({
      //   firstPage: issues.firstPage,
      //   lastPage: issues.lastPage,
      //   nextPage: issues.nextPage,
      //   previousPage: issues.previousPage,
      //   pageNumber: issues.pageNumber,
      //   totalPages: issues.totalPages,
      // });
      // setTotalRecords(issues.totalRecords);
    }
  }, [issues, setState, setPagination, setTotalRecords]);

  useEffect(() => {
    if (issues) setIssues();
  }, [issues, setIssues]);

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

  const items = ["Status", "Terminal ID", "IP", "Issue", "Incident Date"];

  const [enableSwitch, setEnableSwitch] = useState(false);

  const fetchFilterHandle = useCallback(
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
    [dispatch, applicationId, item, range, value]
  );

  const fectchSelectedWithPagingHandler = useCallback(
    (appId: string, msgCat: string, pageNumber: number, pageSize: number) => {
      const filter: ISelectedIIssuePagingFilter = {
        appId,
        item,
        range,
        value,
        pageNumber,
        msgCat,
        pageSize,
      };
      dispatch(DetailsStore.actionCreators.getSelectedPaginatedIssues(filter));
    },
    [item, range, value, dispatch]
  );

  useEffect(() => {
    if (filteringState !== undefined) {
      const appId = String(filteringState?.appId);
      const cat = String(filteringState?.cat);

      if (appId && cat) {
        setEnableSwitch(true);
        if (appId === "IC") {
          setApplicationId("IC");
          if (allowPaging) {
            fectchSelectedWithPagingHandler("IC", cat, 0, pageSize);
          } else {
            fetchFilterHandle("IC", cat);
          }
        }

        if (appId === "EJ") {
          setApplicationId("EJ");
          if (allowPaging) {
            fectchSelectedWithPagingHandler("EJ", cat, 0, pageSize);
          } else {
            fetchFilterHandle("EJ", cat);
          }
        }
      }
    } else {
      if (!isEmpty(rolePrivilege) && !unAuthorizedPage) {
        if (allowPaging) {
          fectchWithPagingHandler(0, pageSize);
        } else {
          fetchHandler();
        }
      }
    }
  }, [
    filteringState,
    rolePrivilege,
    allowPaging,
    fectchSelectedWithPagingHandler,
    fetchFilterHandle,
    fectchWithPagingHandler,
    pageSize,
    fetchHandler,
  ]);

  useEffect(() => {
    return () => (history.location.state = undefined);
  }, [history]);

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
                items={items}
                onRefreshClickHandler={onRefreshClickHandler}
                item={item}
                setItem={setItem}
                setValue={setValue}
                value={value}
                allowPaging={allowPaging}
                onPageClickHandle={onPageClickHandler}
                onPageSizeChange={onPageSizeChange}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setAllowPaging={setAllowPaging}
                customPaginationProps={pagination}
              />
              <Row className="mt-4">
                <Col sm="auto">
                  <span>
                    Total:
                    <strong className="ml-2">{allowPaging ? totalRecords : state?.length}</strong>
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
                  <DetailsTable issues={state} ref={componentRef} />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}

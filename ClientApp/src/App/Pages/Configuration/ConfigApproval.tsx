import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useReactToPrint } from "react-to-print";

import * as ApplicationStore from "../../../store/index";
import * as TerminalConfigStore from "../../../store/TerminalConfigStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import { ITerminalConfigApproval } from "../../../Dtos/ITerminal";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";
import { Col, Row, Card, Spinner } from "react-bootstrap";
import TableTop from "../../components/Common/CustomTableTop";
import TeminalConfigApprovalTable from "../../components/Config/TerminalConfigApproval/TerminalConfigApprovalTable";
import { isEmpty } from "../../../utils/isEmpty";
import { IOnPageChangedData } from "../../components/Pagination/Pagination";

const ConfigApproval = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [terminalConfigs, setTerminalConfigs] = useState<ITerminalConfigApproval[]>([]);
  const [currentTerminalConfigs, setCurrentTerminalConfigs] = useState<ITerminalConfigApproval[]>(
    []
  );
  const [tableContent, setTableContent] = useState<ITerminalConfigApproval[]>([]);

  const items = ["Vendor", "Terminal ID", "IP"];
  const componentRef = useRef<HTMLTableElement>(null);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const user = useSelector((state: ApplicationStore.ApplicationState) => state.auth?.user);

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("terminalconfiguration"));
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

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const globalTerminalConfigs = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.terminalConfigsApproval
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.loading
  );

  const onFetch = useCallback(() => {
    if (globalTerminalConfigs?.data) {
      setTerminalConfigs(globalTerminalConfigs.data);
    }
  }, [globalTerminalConfigs, setTerminalConfigs]);

  useEffect(() => {
    if (globalTerminalConfigs) onFetch();
  }, [globalTerminalConfigs, onFetch]);

  const fetchHandler = useCallback(
    (item: string, value: string) => {
      const terminalConfigFilter: IItemValueFilter = {
        item,
        value,
      };
      dispatch(TerminalConfigStore.actionCreators.getTerminalConfigsApproval(terminalConfigFilter));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user && user.role.toLowerCase().includes("admin")) {
      fetchHandler(item, value);
    } else {
      showMessage();
    }
  }, [user, value, pageSize, fetchHandler, showMessage]);

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentTerminalConfigs = terminalConfigs?.slice(offSet, offSet + pageLimit);
    currentTerminalConfigs = currentTerminalConfigs ? currentTerminalConfigs : [];
    setCurrentTerminalConfigs(currentTerminalConfigs);
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
  };

  useEffect(() => {
    if (allowPaging) setTableContent(currentTerminalConfigs);
    else setTableContent(terminalConfigs);
  }, [allowPaging, setTableContent, terminalConfigs, currentTerminalConfigs]);

  const onExportClickHandler = () => {
    const vendorConfigFilter: IItemValueFilter = {
      item,
      value,
    };
    dispatch(TerminalConfigStore.actionCreators.exportApproveTerminalConfig(vendorConfigFilter));
  };

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.isDownload
  );

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-cog-outline text-info mr-1" />
                  Configuration
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-cog-transfer-outline text-info mr-1" />
                  Config Approval
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
                      history.push("/terminal/addterminal");
                    }}
                  >
                    <i className="mdi mdi-plus-network-outline text-info mr-1" />
                    Add ATM
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="!#"
                    onClick={(event) => {
                      event.preventDefault();
                      history.push("/configuration/terminalconfiguration");
                    }}
                  >
                    <i className="mdi mdi-cog-sync-outline text-info mr-1" />
                    Terminal Configuration
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
                <Col sm={2}>
                  <div className="float-left">
                    <i className="mdi mdi-cog-transfer-outline text-success icon-sm mr-2" />
                    <h5 className="d-inline">Config Approval</h5>
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
                handlePageChanged={handlePageChanged}
                totalRecords={terminalConfigs.length}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {loading ? 0 : terminalConfigs?.length}</h4>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-5">
                  <Col sm="auto">
                    <Spinner size="sm" animation="grow" variant="success" />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <TeminalConfigApprovalTable terminalConfigs={tableContent} ref={componentRef} />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ConfigApproval;

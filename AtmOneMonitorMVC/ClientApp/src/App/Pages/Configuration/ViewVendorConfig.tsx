import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router";
import { Col, Row, Card, Spinner } from "react-bootstrap";

import * as AuthenticationStore from "../../../store/AuthenticationStore";
import * as ApplicationStore from "../../../store/index";
import * as VendorConfigStore from "../../../store/VendorConfigStore";
import { IVendorConfig } from "../../../Dtos/IVendor";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";
import TableTop from "../../components/Common/CustomTableTop";
import ViewVendorConfigTable from "../../components/Config/ViewVendorConfig/ViewVendorConfigTable";
import { isEmpty } from "../../../utils/isEmpty";
import { IOnPageChangedData } from "../../components/Pagination/Pagination";

const ViewVendorConfig = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const componentRef = useRef<HTMLTableElement>(null);
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [vendorConfigs, setVendorConfigs] = useState<IVendorConfig[]>([]);
  const [currentVendorConfigs, setCurrentVendorConfigs] = useState<IVendorConfig[]>([]);
  const [tableContent, setTableContent] = useState<IVendorConfig[]>([]);

  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("viewvendorconfig"));
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

  const globalVendorConfigs = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.vendorConfigs
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.loading
  );

  const items = ["Vendor", "App ID"];

  const onVendorConfig = useCallback(() => {
    if (globalVendorConfigs?.data) {
      setVendorConfigs(globalVendorConfigs.data);
    }
  }, [globalVendorConfigs, setVendorConfigs]);

  useEffect(() => {
    if (globalVendorConfigs) onVendorConfig();
  }, [globalVendorConfigs, onVendorConfig]);

  const fetchHandler = useCallback(
    (item: string, value: string) => {
      const vendorConfigFilter: IItemValueFilter = {
        item,
        value,
      };
      dispatch(VendorConfigStore.actionCreators.getVendorConfigs(vendorConfigFilter));
    },
    [dispatch]
  );

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentVendorConfigs = vendorConfigs?.slice(offSet, offSet + pageLimit);
    currentVendorConfigs = currentVendorConfigs ? currentVendorConfigs : [];
    setCurrentVendorConfigs(currentVendorConfigs);
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
  };

  useEffect(() => {
    if (allowPaging) setTableContent(currentVendorConfigs);
    else setTableContent(vendorConfigs);
  }, [allowPaging, setTableContent, vendorConfigs, currentVendorConfigs]);

  useEffect(() => {
    fetchHandler(item, value);
  }, [value, fetchHandler]);

  const onExportClickHandler = () => {
    const vendorConfigFilter: IItemValueFilter = {
      item,
      value,
    };
    dispatch(VendorConfigStore.actionCreators.export(vendorConfigFilter));
  };

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.isDownload
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
                  <i className="mdi mdi-file-cog-outline text-info mr-1" />
                  View Vendor Configuration
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
                      history.push("/configuration/vendor-configuration");
                    }}
                  >
                    <i className="mdi mdi-cogs text-info mr-1" />
                    Vendor Configuration
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
                <Col sm={3}>
                  <div className="float-left">
                    <i className="mdi mdi-file-cog-outline text-success icon-sm mr-2" />
                    <h5 className="d-inline">View Vendor Configuration</h5>
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
                totalRecords={vendorConfigs.length}
                handlePageChanged={handlePageChanged}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {loading ? 0 : vendorConfigs?.length}</h4>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-5">
                  <Col sm="auto">
                    <Spinner animation="grow" variant="success" />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <ViewVendorConfigTable vendorConfigs={tableContent} ref={componentRef} />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ViewVendorConfig;

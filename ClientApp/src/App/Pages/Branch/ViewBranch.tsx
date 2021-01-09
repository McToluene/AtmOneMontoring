import React, { useState, useCallback, useEffect, useRef } from "react";
import { Col, Row, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

import * as ApplicationStore from "../../../store/index";
import * as BranchStore from "../../../store/BranchStore";
import { IBranch } from "../../../Dtos/IBranch";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";
import ViewBranchTable from "../../components/Branch/ViewBranch/ViewBranchTable";
import TableTop from "../../components/Common/CustomTableTop";
import { IOnPageChangedData } from "../../components/Pagination/Pagination";

const ViewBranch = () => {
  const componentRef = useRef<HTMLTableElement>(null);
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [currentBranches, setCurrentBranches] = useState<IBranch[]>([]);
  const [tableContent, setTableContent] = useState<IBranch[]>([]);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const globalBranches = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.branches
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isBranchLoading
  );

  const dispatch = useDispatch();

  const fetchHandler = useCallback(
    (item: string, value: string) => {
      if (item !== "" && value !== "") {
        const branchFilter: IItemValueFilter = {
          item,
          value,
        };
        dispatch(BranchStore.actionCreators.searchBranches(branchFilter));
      } else {
        dispatch(BranchStore.actionCreators.getBranches());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchHandler(item, value);
  }, [value, fetchHandler]);

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentBranches = branches?.slice(offSet, offSet + pageLimit);
    currentBranches = currentBranches ? currentBranches : [];
    setCurrentBranches(currentBranches);
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
  };

  useEffect(() => {
    if (allowPaging) setTableContent(currentBranches);
    else setTableContent(branches);
  }, [allowPaging, setTableContent, branches, currentBranches]);

  const onBranches = useCallback(() => {
    if (globalBranches?.data) {
      setBranches(globalBranches.data);
    }
  }, [globalBranches, setBranches]);

  useEffect(() => {
    if (globalBranches) onBranches();
  }, [globalBranches, onBranches]);

  const onExportClickHandler = () => {
    const branchFilter: IItemValueFilter = {
      item,
      value,
    };
    dispatch(BranchStore.actionCreators.export(branchFilter));
  };

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isDownload
  );

  const items = ["Branch Name", "Branch Code"];

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-source-branch text-info mr-1" />
                  Branch
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-source-branch text-info mr-1" />
                  View Branch
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
                    <i className="mdi mdi-source-branch text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">View Branches</h5>
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
                totalRecords={branches.length}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {loading ? 0 : branches?.length}</h4>
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
                  <ViewBranchTable branchData={tableContent} ref={componentRef} />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ViewBranch;

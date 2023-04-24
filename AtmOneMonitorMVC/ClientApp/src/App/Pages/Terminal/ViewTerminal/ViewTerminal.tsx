import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

import { ITerminal } from "../../../../Dtos/ITerminal";
import * as ApplicationStore from "../../../../store/index";
import * as TerminalStore from "../../../../store/TerminalStore";
import { IItemValueFilter } from "../../../../Dtos/IItemValueFilter";
import ViewTerminalTable from "../../../components/Terminal/ViewTerminal/ViewTerminalTable";
import TableTop from "../../../components/Common/CustomTableTop";
import { IOnPageChangedData } from "../../../components/Pagination/Pagination";

const ViewTerminal = () => {
  const dispatch = useDispatch();
  const componentRef = useRef<HTMLTableElement>(null);
  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(20);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [terminals, setTerminals] = useState<ITerminal[]>([]);
  const [currentTerminals, setCurrentTerminals] = useState<ITerminal[]>([]);
  const [tableContent, setTableContent] = useState<ITerminal[]>([]);

  const items = ["Vendor", "IP", "Terminal ID"];
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const globalTerminals = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.terminals
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.loading
  );

  const onTerminals = useCallback(() => {
    if (globalTerminals?.data) {
      setTerminals(globalTerminals.data);
    }
  }, [globalTerminals]);

  useEffect(() => {
    if (globalTerminals) onTerminals();
  }, [globalTerminals, onTerminals]);

  const fetchHandler = useCallback(
    (item: string, value: string) => {
      const terminalFilter: IItemValueFilter = {
        item,
        value,
      };
      dispatch(TerminalStore.actionCreators.getTerminals(terminalFilter));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchHandler(item, value);
  }, [fetchHandler, value]);

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentTerminals = terminals?.slice(offSet, offSet + pageLimit);
    currentTerminals = currentTerminals ? currentTerminals : [];
    setCurrentTerminals(currentTerminals);
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
  };

  useEffect(() => {
    if (allowPaging) setTableContent(currentTerminals);
    else setTableContent(terminals);
  }, [allowPaging, setTableContent, terminals, currentTerminals]);

  const onExportClickHandler = () => {
    const terminalFilter: IItemValueFilter = {
      item,
      value,
    };
    dispatch(TerminalStore.actionCreators.export(terminalFilter));
  };

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.isDownload
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
                  <i className="mdi mdi-console-network text-info mr-1" />
                  View Terminal
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
                    <i className="mdi mdi-console-network text-success icon-sm mr-2" />
                    <h5 className="d-inline">View ATM</h5>
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
                pageSize={pageSize}
                setAllowPaging={setAllowPaging}
                setItem={setItem}
                setPageSize={setPageSize}
                setValue={setValue}
                totalRecords={terminals.length}
                value={value}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {loading ? 0 : terminals?.length}</h4>
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
                  <ViewTerminalTable terminals={tableContent} ref={componentRef} />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ViewTerminal;

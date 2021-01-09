import React, { Fragment, useCallback, useState, useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Row, Col, Spinner, Alert } from "react-bootstrap";

import * as ApplicationStore from "../../../store/index";
import * as OperationLogStore from "../../../store/OperationLogsStore";
import { IOperationLog } from "../../../Dtos/IOperationLog";
import TableTop from "../Common/CustomTableTop";
import { IOnPageChangedData } from "../Pagination/Pagination";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";

interface IOperationLogTableProps {
  allowPaging: boolean;
  setAllowPaging: (value: boolean) => void;
  item: string;
  value: string;
  setItem: any;
  setValue: any;
}

const OperationLogTable = forwardRef<HTMLTableElement, IOperationLogTableProps>(
  (props, forwardRef) => {
    const { allowPaging, setAllowPaging, item, setItem, setValue, value } = props;
    const dispatch = useDispatch();
    const globalOperationLogs = useSelector(
      (state: ApplicationStore.ApplicationState) => state.operationLog?.operationLogs
    );

    const loading = useSelector(
      (state: ApplicationStore.ApplicationState) => state.operationLog?.loading
    );

    const [operationLogs, setOperationLogs] = useState<IOperationLog[]>([]);
    const [currentOperationLogs, setCurrentOperationLogs] = useState<IOperationLog[]>([]);
    const [tableContent, setTableContent] = useState<IOperationLog[]>([]);
    const [pageSize, setpageSize] = useState(10);

    const fetchHandler = useCallback(
      (item: string, value: string) => {
        const logsFilter: IItemValueFilter = {
          item,
          value,
        };
        dispatch(OperationLogStore.actionCreators.getOperatonLogs(logsFilter));
      },
      [dispatch]
    );

    useEffect(() => {
      fetchHandler(item, value);
    }, [fetchHandler, value]);

    const setOperationLogState = useCallback(() => {
      if (globalOperationLogs?.data) {
        setOperationLogs(globalOperationLogs.data);
      }
    }, [globalOperationLogs, setOperationLogs]);

    useEffect(() => {
      if (operationLogs) setOperationLogState();
    }, [operationLogs, setOperationLogState]);

    const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
      const offSet = (currentPage - 1) * pageLimit;
      let currentOperationLogs = operationLogs?.slice(offSet, offSet + pageLimit);
      currentOperationLogs = currentOperationLogs ? currentOperationLogs : [];
      setCurrentOperationLogs(currentOperationLogs);
    };

    const onRefreshClickHandler = () => {
      setValue("");
      setItem("");
    };

    useEffect(() => {
      if (allowPaging) setTableContent(currentOperationLogs);
      else setTableContent(operationLogs);
    }, [allowPaging, setTableContent, operationLogs, currentOperationLogs]);

    const items = ["IP", "Log Message", "Incident Date"];

    return (
      <Fragment>
        <TableTop
          items={items}
          onRefreshClickHandler={onRefreshClickHandler}
          item={item}
          setItem={setItem}
          setValue={setValue}
          value={value}
          allowPaging={allowPaging}
          totalRecords={operationLogs?.length}
          handlePageChanged={handlePageChanged}
          pageSize={pageSize}
          setPageSize={setpageSize}
          setAllowPaging={setAllowPaging}
        />
        <Row className="mt-4">
          <Col sm="auto">
            <span>
              Total:
              <strong className="ml-2">{loading ? 0 : operationLogs?.length}</strong>
            </span>
          </Col>
        </Row>
        {!loading && operationLogs.length <= 0 ? (
          <Alert className="mt-3" variant="danger">
            No record found!
          </Alert>
        ) : null}
        {loading ? (
          <Row className="justify-content-md-center mt-3">
            <Col sm="auto">
              <Spinner animation="grow" size="sm" variant="success" />
            </Col>
          </Row>
        ) : (
          <Table
            responsive
            className="table-hover mt-3 table-bordered rounded-0"
            size="sm"
            ref={forwardRef}
          >
            <thead>
              <tr className="table-secondary">
                <th>Terminal ID</th>
                <th>IP</th>
                <th>Log</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tableContent?.map((log, index) => (
                <tr key={index}>
                  <td>{log.terminalId}</td>
                  <td>{log.ip}</td>
                  <td>{log.logMsg}</td>
                  <td>{log.incidentDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Fragment>
    );
  }
);

export default OperationLogTable;

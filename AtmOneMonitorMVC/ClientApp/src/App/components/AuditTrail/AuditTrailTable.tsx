import React, { Fragment, FunctionComponent, useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Row, Table, Button, Spinner, Col, Form } from "react-bootstrap";

import * as ApplicationStore from "../../../store/index";
import * as AuditTrailStore from "../../../store/AuditTrailStore";
import { IAuditTrail } from "../../../Dtos/IAuditTrail";

import AuditSearch from "./AuditSearch";
import IAuditFilter from "../../../Dtos/IAuditFilter";
import Pagination from "../Pagination/Pagination";
import AllowPaging from "../Common/AllowPaging";

interface IAudiTrailTableState {
  auditTrails: IAuditTrail[];
  resultPerPage: number;
  currentAuditTrails: IAuditTrail[];
}

interface IOnPageChangedData {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
}

interface IAuditTrailTableProps {
  userId: number;
  setUserId: any;
  privilegeId: number;
  setPrivilegeId: any;
  dateFrom: string;
  dateTo: string;
  setDisableDateFilter: (disableDateFilter: boolean) => void;
}

const AuditTrailTable: FunctionComponent<IAuditTrailTableProps> = ({
  privilegeId,
  setPrivilegeId,
  setUserId,
  userId,
  dateFrom,
  dateTo,
  setDisableDateFilter,
}) => {
  const auditTrails = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auditTrail?.auditTrails
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auditTrail?.loading
  );

  const [allowPaging, setallowPaging] = useState(false);

  const dispatch = useDispatch();

  const [state, setState] = useState<IAudiTrailTableState>({
    auditTrails: [],
    resultPerPage: 10,
    currentAuditTrails: [],
  });

  const setAuditTrails = useCallback(() => {
    if (auditTrails && auditTrails.succeeded) {
      setState({
        ...state,
        auditTrails: auditTrails.data,
      });
    }
  }, [auditTrails, setState, state]);

  useEffect(() => {
    setAuditTrails();
  }, [auditTrails]);

  const onAllowChange = () => {
    setallowPaging(!allowPaging);
  };

  const onFilterHandler = useCallback(
    (userId: number, privilegeId: number, dateFrom: string, dateTo: string) => {
      const value: IAuditFilter = {
        dateFrom,
        dateTo,
        userId,
        privilegeId,
      };
      dispatch(AuditTrailStore.actionCreators.getFilteredTrails(value));
    },
    [dispatch]
  );

  useEffect(() => {
    if (userId > 0) onFilterHandler(userId, privilegeId, dateFrom, dateTo);
  }, [userId, privilegeId, dateFrom, dateTo]);

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentAuditTrails = state.auditTrails?.slice(offSet, offSet + pageLimit);
    currentAuditTrails = currentAuditTrails ? currentAuditTrails : [];

    setState({
      ...state,
      currentAuditTrails,
    });
  };

  let tableContent = allowPaging ? state.currentAuditTrails : state.auditTrails;

  const history = useHistory();

  return (
    <Fragment>
      <Row className="justify-content-between">
        <AllowPaging allowPaging={allowPaging} onAllowChange={onAllowChange} />
        <AuditSearch
          setDisableDateFilter={setDisableDateFilter}
          privilege={privilegeId}
          setPrivilege={setPrivilegeId}
          user={userId}
          setUser={setUserId}
        />
        {allowPaging ? (
          <Form as={Col} sm="auto" className="form-inline">
            <Form.Label className="mr-2">Result per page</Form.Label>
            <Form.Group controlId="number-pages">
              <Form.Control
                className="rounded-0"
                as="select"
                onChange={(event) =>
                  setState({
                    ...state,
                    resultPerPage: Number(event.target.value),
                  })
                }
                value={state.resultPerPage}
                custom
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </Form.Control>
            </Form.Group>
            <Pagination
              className="my-1 ml-3"
              totalRecords={state.auditTrails?.length}
              pageLimit={state.resultPerPage}
              pageNeighbours={0}
              onPageChanged={handlePageChanged}
            />
          </Form>
        ) : null}
      </Row>
      <Row className="mt-4">
        <Col sm="auto">
          <span>
            Total:
            <strong className="ml-2">{state.auditTrails?.length}</strong>
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
        <Table responsive bordered hover className="mt-3 rounded-0">
          <thead>
            <tr className="table-secondary">
              <th>ID</th>
              <th>Username</th>
              <th>Activity</th>
              <th>Action</th>
              <th>System IP</th>
              <th>Date</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {tableContent?.map((auditTrail, index) => (
              <tr key={index}>
                <td>{auditTrail.auditId}</td>
                <td>{auditTrail.userName}</td>
                <td>{auditTrail.activity}</td>
                <td>{auditTrail.action}</td>
                <td>{auditTrail.sysIp}</td>
                <td>{new Date(auditTrail.logDate).toLocaleString()}</td>
                <td>
                  <Button
                    onClick={() => history.push("/audittrail/detail", auditTrail.auditId)}
                    variant="outline-success"
                    className="rounded-0"
                  >
                    <i className="mdi mdi-view-headline align-middle" />
                    <span className="align-middle"> View</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Fragment>
  );
};

export default AuditTrailTable;

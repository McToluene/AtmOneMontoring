import React, { FunctionComponent } from "react";
import { Form, Pagination, Col } from "react-bootstrap";

interface IPaginateComponentProps {
  setPageSize: (size: number) => void;
  pageSize: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  canNextPage: boolean;
  pageCount: number;
  pageIndex: number;
  previousPage: () => void;
  canPreviousPage: boolean;
  pageOptions: any;
}

const PaginateComponent: FunctionComponent<IPaginateComponentProps> = ({
  setPageSize,
  pageSize,
  gotoPage,
  canNextPage,
  canPreviousPage,
  pageCount,
  pageIndex,
  nextPage,
  previousPage,
  pageOptions,
}) => {
  return (
    <Form as={Col} md={4} className="form-inline">
      <Form.Label className="mr-2">Result per page</Form.Label>
      <Form.Control
        className="rounded-0"
        as="select"
        onChange={(event) => setPageSize(Number(event.target.value))}
        value={pageSize}
        custom
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
        <option value={200}>200</option>
        <option value={250}>250</option>
        <option value={500}>500</option>
        <option value={1000}>1000</option>
        <option value={10000}>10000</option>
      </Form.Control>
      <Pagination className="my-1 mx-3">
        <Pagination.First
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        />
        <Pagination.Prev
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        />

        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
        <Pagination.Last
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />
      </Pagination>
      <span className="my-1">
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>
      </span>
    </Form>
  );
};

export default PaginateComponent;

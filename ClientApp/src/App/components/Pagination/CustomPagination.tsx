import React, { FunctionComponent } from "react";
import { Form, Col, Pagination } from "react-bootstrap";

export interface ICustomPaginationProps {
  setPageSize: (size: number) => void;
  pageSize: number;
  nextPage: string;
  previousPage: string;
  firstPage: string;
  lastPage: string;
  pageNumber: number;
  totalPages: number;
  onPageClickHandle: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const CustomPagination: FunctionComponent<ICustomPaginationProps> = ({
  firstPage,
  lastPage,
  previousPage,
  nextPage,
  pageNumber,
  pageSize,
  totalPages,
  setPageSize,
  onPageClickHandle,
  onPageSizeChange,
}) => {
  return (
    <Form as={Col} sm="auto" className="form-inline">
      <Form.Label className="mr-2">Result per page</Form.Label>
      <Form.Control
        className="rounded-0"
        as="select"
        onChange={(event) => {
          setPageSize(Number(event.target.value));
          onPageSizeChange(Number(event.target.value));
        }}
        value={pageSize}
        custom
      >
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
          onClick={() => onPageClickHandle(0)}
          disabled={firstPage ? false : true}
        />
        <Pagination.Prev
          onClick={() => onPageClickHandle(pageNumber - 1)}
          disabled={previousPage ? false : true}
        />

        <Pagination.Next
          onClick={() => onPageClickHandle(pageNumber + 1)}
          disabled={nextPage ? false : true}
        />
        <Pagination.Last
          onClick={() => onPageClickHandle(totalPages)}
          disabled={lastPage ? false : true}
        />
      </Pagination>
      <span className="my-1">
        Page{" "}
        <strong>
          {totalPages === 0 ? 0 : pageNumber} of {totalPages}
        </strong>
      </span>
    </Form>
  );
};

export default CustomPagination;

import React, { FunctionComponent, useCallback, useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Pagination, { IOnPageChangedData } from "../Pagination/Pagination";
import AllowPaging from "./AllowPaging";
import ItemValueSearch from "./ItemValueSearch";

interface TableTopProps {
  item: string;
  setItem: (item: string) => void;
  value: string;
  setValue: (value: string) => void;
  allowPaging: boolean;
  setAllowPaging: (allowPaging: boolean) => void;
  onRefreshClickHandler: () => void;
  handlePageChanged: (pageChangeData: IOnPageChangedData) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  items: string[];
  disable?: boolean;
  totalRecords: number | undefined;
}

const TableTop: FunctionComponent<TableTopProps> = (props) => {
  const {
    allowPaging,
    setAllowPaging,
    disable,
    item,
    items,
    setItem,
    onRefreshClickHandler,
    setValue,
    value,
    setPageSize,
    pageSize,
    handlePageChanged,
    totalRecords,
  } = props;

  const onAllowChange = () => {
    setAllowPaging(!allowPaging);
  };

  const clearValue = useCallback(() => {
    setValue("");
  }, [setValue]);

  useEffect(() => {
    if (item === "") clearValue();
  }, [item, clearValue]);

  return (
    <Row className="justify-content-between">
      <AllowPaging allowPaging={allowPaging} onAllowChange={onAllowChange} />
      <ItemValueSearch
        disable={disable}
        item={item}
        items={items}
        onRefreshClickHandler={onRefreshClickHandler}
        setItem={setItem}
        setValue={setValue}
        value={value}
      />
      {allowPaging ? (
        <Form as={Col} sm="auto" className="form-inline">
          <Form.Label className="mr-2">Result per page</Form.Label>
          <Form.Control
            className="rounded-0"
            as="select"
            onChange={(event) => {
              setPageSize(parseInt(event.target.value));
            }}
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
          <Pagination
            className="my-1 ml-3"
            totalRecords={totalRecords}
            pageLimit={pageSize}
            pageNeighbours={0}
            onPageChanged={handlePageChanged}
          />
        </Form>
      ) : null}
    </Row>
  );
};

export default TableTop;

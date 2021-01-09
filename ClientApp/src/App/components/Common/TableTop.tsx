import React, { FunctionComponent, useCallback, useEffect } from "react";

import { Row } from "react-bootstrap";
import ItemValueSearch from "./ItemValueSearch";
import CustomPagination from "../Pagination/CustomPagination";
import AllowPaging from "./AllowPaging";
import { ICustomPagingState } from "../../../Dtos/ICustomPagingState";

interface TableTopProps {
  allowPaging: boolean;
  item: string;
  value: string;
  setItem: (item: string) => void;
  setValue: (value: string) => void;
  setAllowPaging: (allowPaging: boolean) => void;
  onRefreshClickHandler: () => void;
  setPageSize: (size: number) => void;
  pageSize: number;
  onPageClickHandle: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  customPaginationProps: ICustomPagingState;
  items: string[];
  disable?: boolean;
}

const TableTop: FunctionComponent<TableTopProps> = (props) => {
  const {
    allowPaging,
    setAllowPaging,
    item,
    setItem,
    setValue,
    value,
    onRefreshClickHandler,
    customPaginationProps,
    onPageClickHandle,
    onPageSizeChange,
    pageSize,
    setPageSize,
    items,
    disable,
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
        <CustomPagination
          {...customPaginationProps}
          onPageClickHandle={onPageClickHandle}
          onPageSizeChange={onPageSizeChange}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      ) : null}
    </Row>
  );
};

export default TableTop;

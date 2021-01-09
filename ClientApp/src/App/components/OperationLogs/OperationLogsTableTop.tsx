import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  MouseEvent,
} from "react";
import { Row } from "react-bootstrap";

import AllowPaging from "../Common/AllowPaging";
import ItemValueSearch from "../Common/ItemValueSearch";
import CustomPagination from "../Pagination/CustomPagination";

interface IOperationLogsTableTopProps {
  pageNumber: number;
  pageSize: number;
  firstPage: string;
  lastPage: string;
  totalPages: number;
  nextPage: string;
  previousPage: string;
  item: string;
  setItem: (item: string) => void;
  value: string;
  onRefreshClickHandler: (event: MouseEvent<HTMLElement>) => void;
  setValue: (value: string) => void;
  onPageClickHandle: (pageNumber: number) => void;
  setPageSize: (size: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  allowPaging: boolean;
  setallowPaging: (value: boolean) => void;
  onSubmitHandler: (tem: string, value: string) => void;
}

const OperationLogsTableTop: FunctionComponent<IOperationLogsTableTopProps> = (
  props
) => {
  const {
    pageNumber,
    pageSize,
    firstPage,
    lastPage,
    totalPages,
    nextPage,
    previousPage,
    setPageSize,
    onPageClickHandle,
    onPageSizeChange,
    allowPaging,
    setallowPaging,
    onSubmitHandler,
    value,
    item,
    setItem,
    setValue,
    onRefreshClickHandler,
  } = props;

  const items = ["IP", "Log Message", "Incident Date"];

  const clearValue = useCallback(() => {
    setValue("");
  }, [item, setValue]);

  useEffect(() => {
    clearValue();
  }, [item, clearValue]);

  const onAllowChange = () => {
    setallowPaging(!allowPaging);
  };

  return (
    <Row>
      <AllowPaging allowPaging={allowPaging} onAllowChange={onAllowChange} />
      <ItemValueSearch
        onRefreshClickHandler={onRefreshClickHandler}
        onSubmitHandler={onSubmitHandler}
        item={item}
        setItem={setItem}
        items={items}
        value={item === "" ? "" : value}
        setValue={setValue}
      />
      {allowPaging ? (
        <CustomPagination
          onPageSizeChange={onPageSizeChange}
          firstPage={firstPage}
          lastPage={lastPage}
          nextPage={nextPage}
          onPageClickHandle={onPageClickHandle}
          pageNumber={pageNumber}
          pageSize={pageSize}
          previousPage={previousPage}
          setPageSize={setPageSize}
          totalPages={totalPages}
        />
      ) : null}
    </Row>
  );
};

export default OperationLogsTableTop;

import React, { ChangeEvent, FunctionComponent } from "react";
import { Form, Col } from "react-bootstrap";

interface IAllowPagingProps {
  allowPaging: boolean;
  onAllowChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AllowPaging: FunctionComponent<IAllowPagingProps> = ({ allowPaging, onAllowChange }) => {
  return (
    <Form as={Col} sm={2} className="form-inline mr-3">
      <Form.Check
        type="switch"
        checked={allowPaging}
        onChange={onAllowChange}
        id="custom-switch"
        label="Allow paging"
      />
    </Form>
  );
};

export default AllowPaging;

import React, { ChangeEvent, FunctionComponent } from "react";
import { Form, Col } from "react-bootstrap";

interface IDateFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disable?: boolean;
}

const DateFilter: FunctionComponent<IDateFilterProps> = (props) => {
  const { dateFrom, dateTo, onDateChange, disable } = props;
  return (
    <Col sm={5}>
      <Form.Row className="justify-content-between">
        <Form.Group as={Col} sm={5} controlId="date-from">
          <Form.Label>Date From</Form.Label>
          <Form.Control
            disabled={disable}
            type="date"
            size="lg"
            value={dateFrom}
            onChange={onDateChange}
            className="rounded-0"
            placeholder="Enter date from"
          />
        </Form.Group>
        <Form.Group as={Col} sm={5} controlId="date-to">
          <Form.Label>Date To</Form.Label>
          <Form.Control
            disabled={disable}
            type="date"
            size="lg"
            value={dateTo}
            onChange={onDateChange}
            className="rounded-0"
            placeholder="Enter date to"
          />
        </Form.Group>
      </Form.Row>
    </Col>
  );
};

export default DateFilter;

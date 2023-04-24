import React, { FunctionComponent, Fragment } from "react";
import { Form } from "react-bootstrap";

interface IItemSelectProps {
  items: string[];
  item: string;
  id: string;
  setItem: (value: string) => void;
  disable?: boolean;
}

const ItemSelect: FunctionComponent<IItemSelectProps> = (props) => {
  const { items, item, setItem, id, disable } = props;

  return (
    <Fragment>
      <Form.Label className="mr-2">{id}</Form.Label>
      <Form.Group controlId={id}>
        <Form.Control
          disabled={disable}
          className="rounded-0"
          onChange={(event) => {
            setItem(event.target.value);
          }}
          value={item || ""}
          as="select"
          custom
        >
          <option value="">Select</option>
          {items.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Fragment>
  );
};

export default ItemSelect;

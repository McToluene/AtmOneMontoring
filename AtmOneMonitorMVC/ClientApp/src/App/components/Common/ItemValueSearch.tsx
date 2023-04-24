import React, { FunctionComponent } from "react";
import { Form, Col, Button } from "react-bootstrap";

import ItemSelect from "./ItemSelect";

interface IItemValueSearchProps {
  item: string;
  setItem: (item: string) => void;
  items: string[];
  value: string;
  setValue: (value: string) => void;
  onRefreshClickHandler: () => void;
  disable?: boolean;
}

const ItemValueSearch: FunctionComponent<IItemValueSearchProps> = (props) => {
  const { item, setItem, items, value, setValue, onRefreshClickHandler, disable } = props;

  return (
    <Form as={Col} sm="auto" inline>
      <ItemSelect id="Item" item={item} setItem={setItem} items={items} disable={disable} />
      <Form.Label className="ml-3 mr-2">Value</Form.Label>
      <Form.Group controlId="search-value">
        <Form.Control
          size="sm"
          className="rounded-0"
          value={value}
          disabled={item === "" || disable}
          onChange={(event) => setValue(event.target.value)}
          type={item === "Incident Date" ? "date" : "text"}
          placeholder="Enter search value"
        />
      </Form.Group>
      <Button
        className="ml-2 rounded-0"
        onClick={onRefreshClickHandler}
        variant="outline-primary"
        size="sm"
      >
        <i className="mdi mdi-refresh align-middle p-0" />
        {/* <span className="align-middle px-1">Refresh </span> */}
      </Button>
    </Form>
  );
};

export default ItemValueSearch;

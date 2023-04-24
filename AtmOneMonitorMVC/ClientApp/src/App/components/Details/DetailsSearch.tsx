import React, { FunctionComponent } from "react";
import { Form } from "react-bootstrap";

interface IDetailsSearch {
  range: number;
  setRange: (range: number) => void;
  applicationId: string;
  setApplicationId: (applicationId: string) => void;
  disable: boolean;
}

const DetailsSearch: FunctionComponent<IDetailsSearch> = (props) => {
  const { range, setRange, applicationId, setApplicationId, disable } = props;
  const items = ["Within two months", "Within this year"];

  return (
    <Form inline>
      <div className="custom-control custom-radio custom-control-inline">
        <input
          disabled={disable}
          type="radio"
          id="ic"
          value="IC"
          onChange={(event) => setApplicationId(event.target.value)}
          checked={applicationId === "IC"}
          name="application-id"
          className="custom-control-input"
        />
        <label className="custom-control-label" htmlFor="ic">
          Camera Issues
        </label>
      </div>
      <div className="custom-control custom-radio custom-control-inline mr-5">
        <input
          disabled={disable}
          type="radio"
          id="ej"
          value="EJ"
          onChange={(event) => setApplicationId(event.target.value)}
          name="application-id"
          checked={applicationId === "EJ"}
          className="custom-control-input"
        />
        <label className="custom-control-label" htmlFor="ej">
          Journal Issues
        </label>
      </div>
      <Form.Label className="mr-1">Range</Form.Label>
      <Form.Group controlId="range">
        <Form.Control
          className="rounded-0"
          onChange={(event) => {
            setRange(parseInt(event.target.value));
          }}
          value={range || 0}
          as="select"
          custom
          disabled={disable}
        >
          <option value={0}>Select</option>
          {items.map((item, index) => (
            <option key={index} value={index + 1}>
              {item}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  );
};

export default DetailsSearch;

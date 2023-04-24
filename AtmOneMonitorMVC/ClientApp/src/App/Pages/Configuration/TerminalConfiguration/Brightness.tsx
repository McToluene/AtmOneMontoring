import React, { FunctionComponent, ChangeEvent } from "react";
import { Row, Form, Col } from "react-bootstrap";

interface ITerminalBrightnessProps {
  imageBrightness: number;
  nightSensitivity: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Brightness: FunctionComponent<ITerminalBrightnessProps> = ({
  imageBrightness,
  nightSensitivity,
  onChange,
}) => {
  return (
    <Col sm={5}>
      <Form as={Row} className="justify-content-sm-center mt-3">
        <Form.Group as={Col} sm={10} controlId="imageBrightness">
          <Form.Label>Image Brightness</Form.Label>
          <Form.Control
            className="mb-0"
            onChange={onChange}
            value={imageBrightness}
            type="range"
            min={0.1}
            max={0.23}
            step={0.01}
            custom
          />
          <Form.Text className="text-muted">(Range from 0.10 to 0.23)</Form.Text>
        </Form.Group>
        <Col sm={2}>
          <span> {imageBrightness}</span>
        </Col>
        <Form.Group as={Col} sm={10} controlId="nightSensitivity">
          <Form.Label>Night Sensitivity </Form.Label>
          <Form.Control
            onChange={onChange}
            value={nightSensitivity}
            type="range"
            min={0.01}
            max={0.1}
            step={0.01}
            custom
          />
          <Form.Text className="text-muted">(Range from 0.01 to 0.1)</Form.Text>
        </Form.Group>
        <Col sm={2}>
          <span> {nightSensitivity}</span>
        </Col>
      </Form>
    </Col>
  );
};

export default Brightness;

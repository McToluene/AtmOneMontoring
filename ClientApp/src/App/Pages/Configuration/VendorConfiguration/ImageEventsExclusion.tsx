import React, { ChangeEvent, FunctionComponent } from "react";
import { Row, Col, Form } from "react-bootstrap";

interface IImageEventsExclusionProps {
  eventsExclude: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ImageEventsExclusion: FunctionComponent<IImageEventsExclusionProps> = (
  props
) => {
  const { eventsExclude, onChange } = props;
  return (
    <Row className="mt-3">
      <Col sm={8}>
        <Form as={Row}>
          <Form.Group as={Col} controlId="eventsExclude">
            <Form.Label>Image Events Exclusion</Form.Label>
            <Form.Control
              size="sm"
              type="textarea"
              className="rounded-0"
              placeholder="Enter Image Events Exclusion"
              value={eventsExclude}
              onChange={onChange}
            />
            <Form.Text className="text-muted">
              This is used in case there is a need to isolate certain images as
              described or identified by event name or number from being
              validated by Intelligent Camera. Use underscore (_) to separate in
              between identifiers
            </Form.Text>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default ImageEventsExclusion;

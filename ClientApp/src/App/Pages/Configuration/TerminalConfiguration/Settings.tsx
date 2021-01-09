import React, { ChangeEvent, FunctionComponent } from "react";
import { Row, Col, Form } from "react-bootstrap";

interface ITerminalSettingsProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  validationMode: string;
  debugLogLevel: number;
  manageCapturing: boolean;
  sendAlert: boolean;
  esclationDelay: number;
  enable: boolean;
}

const Settings: FunctionComponent<ITerminalSettingsProps> = ({
  debugLogLevel,
  enable,
  esclationDelay,
  manageCapturing,
  onChange,
  sendAlert,
  validationMode,
}) => {
  return (
    <Col sm={8}>
      <Form as={Row} className="justify-content-between mt-3">
        <Form.Group as={Col} sm={6} controlId="validationMode">
          <Form.Label>Validation Mode</Form.Label>
          <Form.Control
            value={validationMode}
            onChange={onChange}
            as="select"
            custom
            className="rounded-0"
            placeholder="Select Validation Mode"
          >
            <option value="face_only">FACE-ONLY</option>
            <option value="face_blockage">FACE-BLOCKAGE</option>
            <option value="blockage_only">BLOCKAGE-ONLY</option>
            <option value="blockage_face"> BLOCKAGE-FACE</option>
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} sm={6} controlId="debugLevel">
          <Form.Label>Debug Log Level</Form.Label>
          <Form.Control
            value={debugLogLevel}
            onChange={onChange}
            as="select"
            custom
            className="rounded-0"
            placeholder="Select Debug Log Level"
          >
            <option value={0}>Normal</option>
            <option value={1}>Verbose</option>
            <option value={2}>Optional</option>
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} sm={6} controlId="escalationDelayTimeInMin">
          <Form.Label>Escalation Delay Time (Mins)</Form.Label>
          <Form.Control
            value={esclationDelay}
            onChange={onChange}
            size="sm"
            className="rounded-0"
            placeholder="Enter Escalation Delay Time (Mins)"
          />
        </Form.Group>
        <Col sm={6} className="align-self-center">
          <Form.Check
            checked={sendAlert}
            onChange={onChange}
            type="switch"
            id="sendAlert"
            label="Send alert"
          />
        </Col>
        <Col sm={6} className="align-self-center">
          <Form.Check
            checked={manageCapturing}
            onChange={onChange}
            type="switch"
            id="manageCapturing"
            label="Manage Capturing"
          />
        </Col>
        <Col sm={6} className="align-self-center">
          <Form.Check
            checked={enable}
            onChange={onChange}
            type="switch"
            id="intelliCamEnabled"
            label="Enabled"
          />
        </Col>
      </Form>
    </Col>
  );
};

export default Settings;

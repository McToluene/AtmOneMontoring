import React, { FunctionComponent, useState, useEffect, useCallback, Fragment } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import * as ApplicationStore from "../../../../store/index";
import * as TerminalConfigStore from "../../../../store/TerminalConfigStore";
import { IApproveTerminal } from "../../../../Dtos/ITerminal";

interface ITerminalConfigDetailFormProps {
  terminalConfig: IApproveTerminal;
  configId: number;
}

const TerminConfigDetailForm: FunctionComponent<ITerminalConfigDetailFormProps> = ({
  terminalConfig,
  configId,
}) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  const onApproveClickHandle = () => {
    dispatch(
      TerminalConfigStore.actionCreators.approveConfig({
        configId: configId,
        terminalId: terminalConfig.terminalId,
      })
    );
    setIsClicked(true);
  };

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.loading
  );

  const isConfigApprove = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.isConfigApprove.data
  );

  const onCreateMessage = useCallback(() => {
    if (isConfigApprove) {
      addToast("Terminal configuration approved!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed to approve terminal configuration!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_APPROVE", payload: false });
  }, [isConfigApprove, dispatch, addToast]);

  useEffect(() => {
    if (!loading && isClicked) {
      onCreateMessage();
      setIsClicked(false);
    }
  }, [loading, isClicked, onCreateMessage, setIsClicked]);

  return (
    <Fragment>
      <Row></Row>
      <Row className="mt-2">
        <Col sm={9}>
          <Form.Row className="justify-content-between">
            <Form.Group as={Col} sm={4} controlId="vendor-config">
              <Form.Label>Vendor Configuration</Form.Label>
              <Form.Control
                size="sm"
                disabled={isDisabled}
                value={terminalConfig?.vendorConfigName}
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="ip-address">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.ip}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="vendor">
              <Form.Label>Vendor</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.vendorName}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="terminal-id">
              <Form.Label>Terminal ID</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.terminalId}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={8} controlId="image-path">
              <Form.Label>Image Path</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.imagePath}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={12} controlId="ej-path">
              <Form.Label>EJ Path</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.ejPath}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="validation-mode">
              <Form.Label>Validation Mode</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.validationMode}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Col sm={4} className="my-auto">
              <Form.Check
                checked={terminalConfig.intelliCamEnabled}
                disabled={isDisabled}
                type="switch"
                id="intelliCamEnabled"
                label="Enabled"
              />
            </Col>
            <Col sm={4} className="my-auto">
              <Form.Check
                checked={terminalConfig.manageCapturing}
                disabled={isDisabled}
                type="switch"
                id="manage-Capturing"
                label="Manage Capturing"
              />
            </Col>
            <Form.Group as={Col} sm={4} controlId="eject-mode">
              <Form.Label>Eject Mode</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.ejectMode}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="escalation-time">
              <Form.Label>Escalation Delay Time (Mins)</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.escalationDelayTimeInMin}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Col sm={4} className="my-auto">
              <Form.Check
                checked={terminalConfig.sendAlert}
                disabled={isDisabled}
                type="switch"
                id="send-alert"
                label="Send Alert"
              />
            </Col>
            <Form.Group as={Col} sm={4} controlId="image-brightness">
              <Form.Label>Image Brightness</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.imageBrightness}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="night-sensitivity">
              <Form.Label>Night Sensitivity</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.nightSensitivity}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="updated-by">
              <Form.Label>Updated By</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={terminalConfig?.updatedBy}
                size="sm"
                className="rounded-0"
              />
            </Form.Group>
            <Form.Group as={Col} sm={4} controlId="updated-date">
              <Form.Label>Updated Date</Form.Label>
              <Form.Control
                disabled={isDisabled}
                value={" " || terminalConfig?.updateDate?.toString()}
                size="sm"
                className="rounded-0"
                placeholder="Search Terminal"
              />
            </Form.Group>
            <Col sm={2} className="align-self-center">
              <Button
                onClick={onApproveClickHandle}
                className="rounded-0"
                type="submit"
                size="sm"
                variant="outline-success"
              >
                Approve
                {isClicked ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : null}
              </Button>
            </Col>
          </Form.Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default TerminConfigDetailForm;

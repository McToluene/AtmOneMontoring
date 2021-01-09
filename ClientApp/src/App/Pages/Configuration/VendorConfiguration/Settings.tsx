import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Row, Col, Form, FormControl } from "react-bootstrap";
import {
  FormikErrors,
  FormikTouched,
  useFormikContext,
  FormikValues,
} from "formik";
import { IVendorConfiguration } from "../../../../Dtos/IVendor";

interface ISettingsProps {
  imageFilter: string;
  imagePath: string;
  remoteIp: string;
  remotePort: string;
  wniServiceTimeout: number;
  ejFilter: string;
  ejMode: string;
  ejPath: string;
  atmLogFilter: string;
  atmLogPath: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errors: FormikErrors<IVendorConfiguration>;
  touched: FormikTouched<IVendorConfiguration>;
}

const Settings: FunctionComponent<ISettingsProps> = (props) => {
  const {
    imageFilter,
    atmLogFilter,
    atmLogPath,
    ejFilter,
    ejMode,
    ejPath,
    errors,
    imagePath,
    onChange,
    remoteIp,
    remotePort,
    touched,
    wniServiceTimeout,
  } = props;

  const [isTimeout, setIsTimeout] = useState(true);
  const [isRemoteIp, setIsRemoteIp] = useState(true);
  const [isRemotePort, setIsRemotePort] = useState(true);

  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const onSelectedIndexChange = useCallback(() => {
    switch (values?.ejectMode) {
      case "aandc":
        setIsTimeout(true);
        setIsRemoteIp(true);
        setIsRemotePort(true);
        setFieldValue("wniServiceTimeout", 10);
        setFieldValue("remoteIp", "0.0.0.0");
        setFieldValue("remotePort", "0000");
        break;
      case "adapter":
      case "ext_adpt":
        setIsTimeout(false);
        setIsRemoteIp(true);
        setIsRemotePort(true);
        setFieldValue("wniServiceTimeout", 10);
        setFieldValue("remoteIp", "0.0.0.0");
        setFieldValue("remotePort", "0000");
        break;
      case "network":
      case "network2":
      case "ext_fws":
      case "fws":
        setIsTimeout(false);
        setIsRemoteIp(true);
        setIsRemotePort(false);
        setFieldValue("wniServiceTimeout", "");
        setFieldValue("remoteIp", "0.0.0.0");
        setFieldValue("remotePort", "");
        break;
      case "switch":
        setIsTimeout(true);
        setIsRemoteIp(false);
        setIsRemotePort(false);
        setFieldValue("wniServiceTimeout", 10);
        setFieldValue("remoteIp", "");
        setFieldValue("remotePort", "");
        break;
      default:
        setIsTimeout(true);
        setIsRemoteIp(true);
        setIsRemotePort(true);
        setFieldValue("wniServiceTimeout", 10);
        setFieldValue("remoteIp", "0.0.0.0");
        setFieldValue("remotePort", "0000");
        break;
    }
  }, [values, setFieldValue]);

  useEffect(() => {
    onSelectedIndexChange();
  }, [onSelectedIndexChange]);

  return (
    <Row className="mt-3">
      <Col sm={8}>
        <Form as={Row}>
          <Form.Group as={Col} sm={8} controlId="imagePath">
            <Form.Label>Monitoring Path (Image / Ej)</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Monitoring Path (Image / Ej)"
              onChange={onChange}
              value={imagePath}
              isInvalid={errors?.imagePath && touched.imagePath ? true : false}
            />
            {errors?.imagePath ? (
              <FormControl.Feedback type="invalid">
                {errors?.imagePath}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={4} controlId="imageFilter">
            <Form.Label>File Extention</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter File Extension"
              onChange={onChange}
              value={imageFilter}
              isInvalid={
                errors?.imageFilter && touched.imageFilter ? true : false
              }
            />
            {errors?.imageFilter ? (
              <FormControl.Feedback type="invalid">
                {errors?.imageFilter}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={8} controlId="atmLogPath">
            <Form.Label>ATM Log Path</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter ATM Log Path"
              onChange={onChange}
              value={atmLogPath}
              isInvalid={
                errors?.atmLogPath && touched.atmLogPath ? true : false
              }
            />
            {errors?.atmLogPath ? (
              <FormControl.Feedback type="invalid">
                {errors?.atmLogPath}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={4} controlId="atmLogFilter">
            <Form.Label>ATM Log File Filter</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Log File Path"
              onChange={onChange}
              value={atmLogFilter}
              isInvalid={
                errors?.atmLogFilter && touched.atmLogFilter ? true : false
              }
            />
            {errors?.atmLogFilter ? (
              <FormControl.Feedback type="invalid">
                {errors?.atmLogFilter}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={8} controlId="ejPath">
            <Form.Label>Electronic Journal Path (EJ) </Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Electronic Journal Path"
              onChange={onChange}
              value={ejPath}
              isInvalid={errors?.ejPath && touched.ejPath ? true : false}
            />
            {errors?.ejPath ? (
              <FormControl.Feedback type="invalid">
                {errors?.ejPath}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={4} controlId="ejFilter">
            <Form.Label>Electronic Journal Filter </Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Electronic Journal Filter"
              onChange={onChange}
              value={ejFilter}
              isInvalid={errors?.ejFilter && touched.ejFilter ? true : false}
            />
            {errors?.ejFilter ? (
              <FormControl.Feedback type="invalid">
                {errors?.ejFilter}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={8} controlId="ejectMode">
            <Form.Label>EjectMode</Form.Label>
            <Form.Control
              as="select"
              custom
              className="rounded-0"
              placeholder="Enter EjectMode"
              onChange={onChange}
              value={ejMode}
            >
              <option value="aandc">AANDC</option>
              <option value="ext_adpt">NT-MANAGE</option>
              <option value="xfs">XFS</option>
              <option value="switch"> Host</option>
              <option value="ext_fws">FWS-MANAGER</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} sm={4} controlId="wniServiceTimeout">
            <Form.Label>Out Of Service Timeout</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Out Of Service Timeout"
              onChange={onChange}
              value={wniServiceTimeout}
              disabled={isTimeout}
              isInvalid={
                errors?.wniServiceTimeout && touched.wniServiceTimeout
                  ? true
                  : false
              }
            />
            {errors?.wniServiceTimeout ? (
              <FormControl.Feedback type="invalid">
                {errors?.wniServiceTimeout}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={8} controlId="remoteIp">
            <Form.Label>Remote IP</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Remote IP"
              onChange={onChange}
              disabled={isRemoteIp}
              value={remoteIp}
              isInvalid={errors?.remoteIp && touched.remoteIp ? true : false}
            />
            {errors?.remoteIp ? (
              <FormControl.Feedback type="invalid">
                {errors?.remoteIp}
              </FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={4} controlId="remotePort">
            <Form.Label>Remote Port</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              placeholder="Enter Remote Port"
              onChange={onChange}
              disabled={isRemotePort}
              value={remotePort}
            />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Settings;

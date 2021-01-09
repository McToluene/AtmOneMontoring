import React, { FunctionComponent, ChangeEvent } from "react";
import { Form, Row, Col, FormControl } from "react-bootstrap";
import { FormikErrors, FormikTouched } from "formik";

import { IVendorConfiguration } from "../../../../Dtos/IVendor";
import VendorSelect from "../../../components/Common/VendorSelect";

interface IVendorSelectionProps {
  configurationName: string;
  applicationId: string;
  vendor: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errors: FormikErrors<IVendorConfiguration>;
  touched: FormikTouched<IVendorConfiguration>;
}

const VendorSelection: FunctionComponent<IVendorSelectionProps> = ({
  applicationId,
  vendor,
  configurationName,
  onChange,
  errors,
  touched,
}) => {
  return (
    <Row className="mt-1">
      <Col sm={6}>
        <Form.Row className="justify-content-between">
          <Form.Group as={Col} sm={12} controlId="vendorConfigName">
            <Form.Label>Configuration Name</Form.Label>
            <Form.Control
              size="sm"
              className="rounded-0"
              value={configurationName}
              onChange={onChange}
              placeholder="Configuration Name"
              isInvalid={errors?.vendorConfigName && touched.vendorConfigName ? true : false}
            />
            {errors?.vendorConfigName ? (
              <FormControl.Feedback type="invalid">{errors?.vendorConfigName}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={7} controlId="appId">
            <Form.Label>Application ID</Form.Label>
            <Form.Control
              className="rounded-0"
              onChange={onChange}
              value={applicationId}
              as="select"
              custom
            >
              <option value="IC">Intelligent Camera</option>
              <option value="EJ">EJ Monitor</option>
            </Form.Control>
          </Form.Group>
          <VendorSelect isUpdate={false} vendor={vendor} onChange={onChange} />
        </Form.Row>
      </Col>
    </Row>
  );
};

export default VendorSelection;

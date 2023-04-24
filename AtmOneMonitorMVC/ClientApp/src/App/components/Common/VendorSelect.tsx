import React, {
  Fragment,
  FunctionComponent,
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Col, Spinner } from "react-bootstrap";

import * as ApplicationStore from "../../../store/index";
import * as VendorStore from "../../../store/VendorStore";
import { IVendor } from "../../../Dtos/IVendor";

interface IVendorSelectProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  vendor: number;
  isUpdate: boolean;
  sm?: number;
  md?: number;
}

const VendorSelect: FunctionComponent<IVendorSelectProps> = (props) => {
  const { onChange, vendor, isUpdate, sm, md } = props;
  const dispatch = useDispatch();

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.vendor?.loading);

  const vendors = useSelector((state: ApplicationStore.ApplicationState) => state.vendor?.vendors);

  const [stateVendors, setStateVendors] = useState<IVendor[]>([]);

  const onVendors = useCallback(() => {
    if (vendors) setStateVendors(vendors);
  }, [vendors, setStateVendors]);

  useEffect(() => {
    dispatch(VendorStore.actionCreators.getVendors());
  }, [dispatch]);

  useEffect(() => {
    onVendors();
  }, [vendors, onVendors]);

  return (
    <Fragment>
      <Form.Group as={Col} md={md} sm={sm} controlId="vendorId">
        <Form.Label>Vendors</Form.Label>
        <Form.Control
          className="rounded-0"
          onChange={onChange}
          value={vendor || ""}
          as="select"
          disabled={loading || isUpdate}
          custom
        >
          {stateVendors?.map((vendor) => (
            <option key={vendor.vendorId} value={vendor.vendorId}>
              {vendor.vendor}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {loading ? (
        <Col className="align-self-center" sm="auto">
          <Spinner
            variant="success"
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        </Col>
      ) : null}
    </Fragment>
  );
};

export default VendorSelect;

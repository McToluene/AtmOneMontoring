import React, { FunctionComponent, useState, useCallback, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Col } from "react-bootstrap";

import * as ApplicationStore from "../../../store/index";
import * as VendorConfigStore from "../../../store/VendorConfigStore";
import { IVendorConfig } from "../../../Dtos/IVendor";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";

interface IVendorConfigSelectProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  vendorConfig: number;
  isDisbaled?: boolean;
  setVendorConfigSelectLoading: (isVendorConfigLoading: boolean) => void;
}

const VendorConfigSelect: FunctionComponent<IVendorConfigSelectProps> = (props) => {
  const { onChange, vendorConfig, isDisbaled } = props;
  const dispatch = useDispatch();

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.loading
  );

  const globalVendorConfigs = useSelector(
    (state: ApplicationStore.ApplicationState) => state.vendorConfig?.vendorConfigs
  );

  const [vendorConfigs, setVendorConfigs] = useState<IVendorConfig[]>([]);

  const onVendorConfigFetch = useCallback(() => {
    if (globalVendorConfigs) setVendorConfigs(globalVendorConfigs.data);
  }, [globalVendorConfigs, setVendorConfigs]);

  useEffect(() => {
    const vendorConfigFilter: IItemValueFilter = {
      item: "",
      value: "",
    };
    dispatch(VendorConfigStore.actionCreators.getVendorConfigs(vendorConfigFilter));
  }, [dispatch]);

  useEffect(() => {
    onVendorConfigFetch();
  }, [vendorConfigs, onVendorConfigFetch]);

  useEffect(() => {
    if (loading !== undefined) props.setVendorConfigSelectLoading(loading);
  }, [loading]);

  return (
    <Form.Group as={Col} sm={4} controlId="vendorConfigId">
      <Form.Label>Vendor Configuration</Form.Label>
      <Form.Control
        className="rounded-0"
        onChange={onChange}
        value={vendorConfig || ""}
        as="select"
        disabled={loading || isDisbaled}
        custom
      >
        {vendorConfigs?.map((vendorConfig) => (
          <option key={vendorConfig.vendorConfigId} value={vendorConfig.vendorConfigId}>
            {vendorConfig.vendorConfigName}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default VendorConfigSelect;

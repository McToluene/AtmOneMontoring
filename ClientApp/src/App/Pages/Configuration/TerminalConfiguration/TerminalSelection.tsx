import React, { ChangeEvent, FunctionComponent, useEffect, useCallback, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import VendorConfigSelect from "../../../components/Common/VendorConfigSelect";
import VendorSelect from "../../../components/Common/VendorSelect";
import AddRemoveTerminal from "../../../components/Config/TerminalConfig/AddRemoveTerminal";
import * as ApplicationStore from "../../../../store/index";
import * as TerminalConfigStore from "../../../../store/TerminalConfigStore";
import { ITerminalVendor } from "../../../../Dtos/ITerminal";

interface ITerminalSelectionProps {
  vendorConfigId: number;
  vendor: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedTerminals: ITerminalVendor[];
  setSelectedTerminals: any;
  isUpdate: boolean;
}
const TerminalSelection: FunctionComponent<ITerminalSelectionProps> = ({
  onChange,
  vendor,
  vendorConfigId,
  selectedTerminals,
  setSelectedTerminals,
  isUpdate,
}) => {
  const dispatch = useDispatch();
  const [terminals, setTerminals] = useState<ITerminalVendor[]>([]);

  const [isTerminalLoading, setisTerminalLoading] = useState(false);
  const [isVendorConfigSelect, setIsVendorConfigSelect] = useState(false);

  const globalTerminals = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminalConfig?.terminals
  );

  useEffect(() => {
    dispatch(TerminalConfigStore.actionCreators.getTerminalByVendor(vendor));
    setisTerminalLoading(true);
  }, [vendor, dispatch, setisTerminalLoading]);

  const onTerminals = useCallback(() => {
    if (globalTerminals?.data) {
      setTerminals(globalTerminals.data);
      setisTerminalLoading(false);
    }
  }, [globalTerminals, setTerminals]);

  useEffect(() => {
    if (globalTerminals) onTerminals();
  }, [globalTerminals, onTerminals]);

  const onAddHandle = (value: ITerminalVendor) => {
    const filtered = terminals?.filter((terminal) => terminal.terminalId !== value.terminalId);
    setSelectedTerminals(selectedTerminals.concat(value));
    if (filtered) setTerminals(filtered);
  };

  const onAddAllClick = () => {
    const filtered = terminals.splice(0, terminals.length);
    setTerminals((terminals) => terminals.splice(0, terminals.length));
    setSelectedTerminals((selectedTerminals: any) => [...selectedTerminals, ...filtered]);
  };

  const onRemoveAllClick = () => {
    const filtered = selectedTerminals.splice(0, selectedTerminals.length);
    setSelectedTerminals((selectedTerminals: any) =>
      selectedTerminals.splice(0, selectedTerminals.length)
    );
    setTerminals((terminals) => [...terminals, ...filtered]);
  };

  const onRemoveHandle = (value: ITerminalVendor) => {
    const filtered = selectedTerminals?.filter(
      (terminal) => terminal.terminalId !== value.terminalId
    );

    setTerminals((terminals) => [value, ...terminals]);
    if (filtered) setSelectedTerminals(filtered);
  };

  useEffect(() => {
    if (vendor) setSelectedTerminals([]);
  }, [vendor]);

  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    let filtered;
    if (!event.target.value) {
      filtered = globalTerminals?.data;
    } else {
      filtered = terminals?.filter(
        (terminal) =>
          terminal.terminalId.includes(event.target.value) ||
          terminal.terminalId === event.target.value
      );
    }

    if (filtered) setTerminals(filtered);
  };

  return (
    <Col>
      <Row>
        <VendorConfigSelect
          setVendorConfigSelectLoading={setIsVendorConfigSelect}
          vendorConfig={vendorConfigId}
          onChange={onChange}
        />
        <VendorSelect isUpdate={isUpdate} vendor={vendor} onChange={onChange} sm={6} md={3} />
        <Form.Group as={Col} sm={2} controlId="terminal-filter">
          <Form.Label>Search Terminal</Form.Label>
          <Form.Control
            size="sm"
            type="number"
            className="rounded-0"
            onChange={onSearch}
            placeholder="Search Terminal"
          />
        </Form.Group>
        <Col className="align-self-center" sm="auto">
          {isVendorConfigSelect ? (
            <Spinner
              variant="success"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : null}
        </Col>
      </Row>
      <Row>
        <AddRemoveTerminal
          isUpdate={isUpdate}
          onAddAllClick={onAddAllClick}
          onAddHandle={onAddHandle}
          onRemoveAllClick={onRemoveAllClick}
          onRemoveHandle={onRemoveHandle}
          selectedTerminals={selectedTerminals}
          terminals={terminals}
          isTerminalLoading={isTerminalLoading}
        />
      </Row>
    </Col>
  );
};

export default TerminalSelection;

import React, { useState, useCallback, useEffect } from "react";
import { Col, Row, Form, Button, Spinner, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { CSVReader } from "react-papaparse";
import { useToasts } from "react-toast-notifications";
import ContentEditable from "react-contenteditable";

import * as ApplicationStore from "../../../../store/index";
import * as TerminalStore from "../../../../store/TerminalStore";
import { ITerminalCreate } from "../../../../Dtos/ITerminal";

const AddWithCsv = () => {
  const { addToast } = useToasts();

  const vendors = useSelector((state: ApplicationStore.ApplicationState) => state.vendor?.vendors);

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.loading
  );

  const isCreated = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.isCreated.data
  );

  const [terminals, setTerminals] = useState<any[]>([]);

  const dispatch = useDispatch();
  const [vendor, setVendor] = useState(1);
  const [isCreateClick, setIsCreateClick] = useState(false);

  const handleOnDrop = (data: any) => {
    setTerminals(data);
  };

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data: any) => {
    // console.log(data);
  };

  const onSubmit = () => {
    const preparedTerminals: ITerminalCreate[] = [];
    terminals.forEach((terminal, index) => {
      if (index > 0) {
        const newTerminal: ITerminalCreate = {
          terminalId: "",
          ip: "",
          branchId: 0,
          id: 0,
          vendorId: 0,
          title: "",
        };

        terminal?.data.forEach((value: any, index: number) => {
          if (index === 0) newTerminal.ip = value;
          if (index === 1) newTerminal.terminalId = value;
          if (index === 2) newTerminal.title = value;
          if (index === 4) newTerminal.vendorId = value ? value : vendor;
        });

        preparedTerminals.push(newTerminal);
      }
    });

    dispatch(TerminalStore.actionCreators.addTerminals(preparedTerminals));
    setIsCreateClick(true);
  };

  const onCreateMessage = useCallback(() => {
    if (isCreated) {
      addToast("Terminals successfully added!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed to create some/all terminals!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_CREATED", payload: false });
  }, [isCreated, addToast, dispatch]);

  useEffect(() => {
    if (!loading && isCreateClick) {
      onCreateMessage();
      setIsCreateClick(false);
    }
  }, [loading, isCreateClick, onCreateMessage, setIsCreateClick]);

  const handleChange = (event: any, editIndex: number, editValueIndex: number) => {
    terminals?.forEach((terminal, index) =>
      index === editIndex ? (terminal.data[editValueIndex] = event.target.value) : terminal
    );
    setTerminals(terminals);
  };

  const onDeleteHandle = (inx: number) => {
    setTerminals((terminals) => terminals.filter((terminal, index) => index !== inx));
  };

  return (
    <Row className="justify-content-sm-center mt-3">
      <Col sm={12}>
        <form className="form form-row">
          <Col sm={6} className="mr-5">
            <CSVReader
              onDrop={handleOnDrop}
              onError={handleOnError}
              style={{ padding: "0px" }}
              config={{}}
              addRemoveButton
              onRemoveFile={handleOnRemoveFile}
            >
              <span>Drop CSV file here or click to upload.</span>
            </CSVReader>
          </Col>
          <Col sm="auto">
            <Row>
              <Form.Group as={Col} sm={12} controlId="number-pages">
                <Form.Label>Vendor</Form.Label>
                <Form.Control
                  value={vendor}
                  onChange={(event) => setVendor(parseInt(event?.target.value))}
                  size="lg"
                  custom
                  className="rounded-0"
                  as="select"
                >
                  {vendors?.map((vendor) => (
                    <option key={vendor.vendorId}>{vendor.vendor}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Col>
                <Button
                  onClick={onSubmit}
                  disabled={terminals.length <= 0 || isCreateClick}
                  className="rounded-0 mt-2"
                  size="sm"
                  variant="outline-success"
                >
                  Create
                  {loading ? (
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : null}
                </Button>
              </Col>
            </Row>
          </Col>
        </form>
        <Row>
          <Col>
            {terminals?.length > 0 ? (
              <Table responsive bordered hover className="mt-4 rounded-0" size="sm">
                <thead>
                  {terminals?.map((terminal, index) =>
                    index === 0 ? (
                      <tr key={index} className="table-secondary">
                        {terminal?.data?.map((title: any, titleIndex: number) => (
                          <th key={titleIndex}>{title}</th>
                        ))}
                        <th></th>
                      </tr>
                    ) : null
                  )}
                </thead>
                <tbody>
                  {terminals?.map((terminal, index) =>
                    index > 0 ? (
                      <tr key={index}>
                        {terminal?.data?.map((value: any, valueIndex: number) => (
                          <td key={valueIndex}>
                            <ContentEditable
                              key={valueIndex}
                              html={`${value}`}
                              disabled={false}
                              onChange={(event) => handleChange(event, index, valueIndex)}
                            />
                          </td>
                        ))}
                        <td>
                          <Button
                            onClick={() => onDeleteHandle(index)}
                            className="rounded-0"
                            size="sm"
                            variant="outline-danger"
                          >
                            <i className="mdi mdi-delete align-middle" />
                            <span className="align-middle"> Delete </span>
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </Table>
            ) : null}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default AddWithCsv;

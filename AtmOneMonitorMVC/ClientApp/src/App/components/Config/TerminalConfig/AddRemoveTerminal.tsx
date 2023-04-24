import React, { FunctionComponent, Fragment } from "react";
import { ITerminalVendor } from "../../../../Dtos/ITerminal";
import {
  Spinner,
  Col,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Button,
  ListGroupItem,
} from "react-bootstrap";

interface IAddRemoveTerminal {
  terminals: ITerminalVendor[];
  selectedTerminals: ITerminalVendor[];
  isTerminalLoading: boolean;
  onAddHandle: (value: ITerminalVendor) => void;
  onAddAllClick: () => void;
  onRemoveAllClick: () => void;
  onRemoveHandle: (value: ITerminalVendor) => void;
  isUpdate: boolean;
}

const AddRemoveTerminal: FunctionComponent<IAddRemoveTerminal> = ({
  terminals,
  selectedTerminals,
  isTerminalLoading,
  onAddAllClick,
  onAddHandle,
  onRemoveAllClick,
  onRemoveHandle,
  isUpdate,
}) => {
  return (
    <Fragment>
      <Col sm={4}>
        <div style={{ height: "30vh", overflow: "auto" }} className="border border-secondary">
          {isTerminalLoading ? (
            <Spinner
              variant="success"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <ListGroup className="rounded-0">
              {terminals?.map((terminal, index) => (
                <OverlayTrigger
                  key={index}
                  placement="left"
                  overlay={
                    <Tooltip id={`tooltip-${index}`}>
                      Click on terminal to
                      <strong className="text-success"> add</strong>.
                    </Tooltip>
                  }
                >
                  <Button
                    disabled={isUpdate}
                    as={ListGroupItem}
                    variant="outline-success"
                    onClick={() => onAddHandle(terminal)}
                    className="list-group-flush list-group-item-action"
                  >
                    {terminal.terminalId + " - " + terminal.ip}
                  </Button>
                </OverlayTrigger>
              ))}
            </ListGroup>
          )}
        </div>
      </Col>
      <Col sm={1} className="align-self-center">
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id={`tooltip-add-all`}>
              Click to<strong className="text-success"> add</strong> all terminals.
            </Tooltip>
          }
        >
          <Button onClick={onAddAllClick} variant="outline-success" className="rounded-0">
            <i className="mdi mdi-chevron-triple-right px-1 align-middle" />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id={`tooltip-remove-all`}>
              Click to<strong className="text-danger"> remove</strong> all terminals.
            </Tooltip>
          }
        >
          <Button onClick={onRemoveAllClick} variant="outline-danger" className="rounded-0 mt-1">
            <i className="mdi mdi-chevron-triple-left px-1 align-middle" />
          </Button>
        </OverlayTrigger>
      </Col>
      <Col sm={4}>
        <div style={{ height: "30vh", overflow: "auto" }} className="border border-secondary">
          <ListGroup className="rounded-0">
            {selectedTerminals?.map((terminal, index) => (
              <OverlayTrigger
                key={index}
                placement="right"
                overlay={
                  <Tooltip id={`tooltip-${index}`}>
                    Click on terminal to
                    <strong className="text-danger"> remove</strong>.
                  </Tooltip>
                }
              >
                <Button
                  variant="outline-danger"
                  onClick={() => onRemoveHandle(terminal)}
                  as={ListGroupItem}
                  className="list-group-flush list-group-item-action"
                >
                  {terminal.terminalId + " - " + terminal.ip}
                </Button>
              </OverlayTrigger>
            ))}
          </ListGroup>
        </div>
      </Col>
    </Fragment>
  );
};

export default AddRemoveTerminal;

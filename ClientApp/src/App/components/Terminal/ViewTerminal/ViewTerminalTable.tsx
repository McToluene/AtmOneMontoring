import React, { forwardRef } from "react";
import { ITerminal } from "../../../../Dtos/ITerminal";
import { useHistory } from "react-router";
import { Table, Button } from "react-bootstrap";

interface IViewTerminalTableProps {
  terminals: ITerminal[];
}

const ViewTerminalTable = forwardRef<HTMLTableElement, IViewTerminalTableProps>(
  (props, forwardRef) => {
    const history = useHistory();
    return (
      <Table
        responsive
        className="table-hover table-bordered mt-3 rounded-0"
        size="sm"
        ref={forwardRef}
      >
        <thead className="table-secondary">
          <tr>
            <th>Terminal ID</th>
            <th>IP</th>
            <th>Vendor</th>
            <th>Title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.terminals?.map((terminal, index) => (
            <tr key={index}>
              <td>{terminal.terminalId}</td>
              <td>{terminal.ip}</td>
              <td>{terminal.vendor}</td>
              <td>{terminal.title}</td>
              <td>
                <Button
                  className="rounded-0"
                  size="sm"
                  onClick={() => history.push("/terminal/addterminal", terminal.terminalId)}
                  variant="outline-dark"
                >
                  <i className="mdi mdi-file-edit-outline align-middle" />
                  <span className="align-middle">Detail/Edit</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);

export default ViewTerminalTable;

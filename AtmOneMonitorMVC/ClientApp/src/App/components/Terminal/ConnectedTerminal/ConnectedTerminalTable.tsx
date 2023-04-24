import React, { forwardRef } from "react";
import { IOnlineTerminal } from "../../../../Dtos/ITerminal";
import { Table } from "react-bootstrap";

interface IViewTerminalTableProps {
  onlineTerminals: IOnlineTerminal[];
}

const ConnectedTerminalTable = forwardRef<HTMLTableElement, IViewTerminalTableProps>(
  (props, forwardRef) => (
    <Table responsive hover bordered className="mt-3 rounded-0" size="sm" ref={forwardRef}>
      <thead className="table-secondary">
        <tr>
          <th>Terminal ID</th>
          <th>IP</th>
          <th>Vendor</th>
          <th>Last Connected Date</th>
        </tr>
      </thead>
      <tbody>
        {props.onlineTerminals?.map((terminal, index) => (
          <tr key={index}>
            <td>{terminal.terminalId}</td>
            <td>{terminal.ip}</td>
            <td>{terminal.vendor}</td>
            <td>{terminal.onlineDate}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
);

export default ConnectedTerminalTable;

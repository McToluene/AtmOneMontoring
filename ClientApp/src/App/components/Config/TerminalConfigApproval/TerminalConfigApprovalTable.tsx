import React, { forwardRef } from "react";
import { ITerminalConfigApproval } from "../../../../Dtos/ITerminal";
import { useHistory } from "react-router";
import { Table, Button } from "react-bootstrap";

interface ITeminalConfigApprovalTableProps {
  terminalConfigs: ITerminalConfigApproval[];
}

const TeminalConfigApprovalTable = forwardRef<HTMLTableElement, ITeminalConfigApprovalTableProps>(
  (props, forwardRef) => {
    const history = useHistory();
    return (
      <Table responsive hover className="mt-3 table-bordered rounded-0" size="sm" ref={forwardRef}>
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>IP</th>
            <th>Terminal ID</th>
            <th>Vendor</th>
            <th>Eject Mode</th>
            <th>Validation Mode</th>
            <th>Intellicam Enabled</th>
            <th>Manage Capturing</th>
            <th>Image Brightness</th>
            <th>Night Sensitivity</th>
            <th>Approved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.terminalConfigs?.map((terminal, index) => (
            <tr key={index}>
              <td>{terminal.configId}</td>
              <td>{terminal.ip}</td>
              <td>{terminal.terminalId}</td>
              <td>{terminal.vendorName}</td>
              <td>{terminal.ejectMode}</td>
              <td>{terminal.validationMode}</td>
              <td>{String(terminal.intelliCamEnabled).toString().toLocaleUpperCase()}</td>
              <td>{String(terminal.manageCapturing).toString().toLocaleUpperCase()}</td>
              <td>{terminal.imageBrightness}</td>
              <td>{terminal.nightSensitivity}</td>
              <td>{String(terminal.approved).toString().toLocaleUpperCase()}</td>
              <td>
                <Button
                  className="rounded-0"
                  onClick={() =>
                    history.push(
                      "/configuration/viewterminalconfigurationdetail",
                      terminal.configId
                    )
                  }
                  variant="outline-success"
                >
                  <i className="mdi mdi-view-headline align-middle" />
                  <span className="align-middle"> View</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);

export default TeminalConfigApprovalTable;

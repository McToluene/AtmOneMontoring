import React, { forwardRef } from "react";
import { useHistory } from "react-router";
import { Table, Button } from "react-bootstrap";

import { ITerminalConfig } from "../../../../Dtos/ITerminal";

interface IViewTerminalConfigTableProps {
  terminalConfigs: ITerminalConfig[];
}

const ViewTerminalConfigTable = forwardRef<HTMLTableElement, IViewTerminalConfigTableProps>(
  (props, forwardRef) => {
    const history = useHistory();
    return (
      <Table responsive bordered hover className="mt-3 rounded-0" size="sm" ref={forwardRef}>
        <thead className="table-secondary">
          <tr>
            <th>AppID</th>
            <th>IP</th>
            <th>Vendor</th>
            <th>Image Path</th>
            <th>Manage Capturing</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.terminalConfigs?.map((terminalConfig, index) => (
            <tr key={index}>
              <td>{terminalConfig.appId}</td>
              <td>{terminalConfig.ip}</td>
              <td>{terminalConfig.vendor}</td>
              <td>{terminalConfig.imagePath}</td>
              <td>{String(terminalConfig.manageCapturing).toString().toLocaleUpperCase()}</td>
              <td>
                <Button
                  className="rounded-0"
                  onClick={() =>
                    history.push("/configuration/terminalconfiguration", terminalConfig.configId)
                  }
                  variant="outline-dark"
                >
                  <i className="mdi mdi-file-edit-outline align-middle" />
                  <span className="align-middle">Edit Terminal Config</span>
                </Button>
              </td>
              <td>
                <Button
                  className="rounded-0"
                  onClick={() =>
                    history.push(
                      "/configuration/vendorconfiguration",
                      terminalConfig.vendorConfigId
                    )
                  }
                  variant="outline-info"
                >
                  <i className="mdi mdi-file-edit-outline align-middle" />
                  <span className="align-middle">Edit Vendor Config</span>
                </Button>
              </td>
              <td>
                <Button
                  className="rounded-0"
                  onClick={() =>
                    history.push(
                      "/configuration/viewterminalconfigurationdetail",
                      terminalConfig.configId
                    )
                  }
                  variant="outline-success"
                >
                  <i className="mdi mdi-view-headline align-middle" />
                  <span className="align-middle">View</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);

export default ViewTerminalConfigTable;

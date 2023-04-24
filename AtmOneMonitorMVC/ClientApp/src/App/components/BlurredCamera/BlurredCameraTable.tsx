import React, { forwardRef } from "react";

import { Table } from "react-bootstrap";
import { IBlurredTerminal } from "../../../Dtos/ITerminal";

interface IBlurredCameraTableProps {
  cameras: IBlurredTerminal[];
}

const BlurredCameraTable = forwardRef<HTMLTableElement, IBlurredCameraTableProps>(
  (props, forwardRef) => (
    <Table
      responsive
      className="table-hover mt-3 table-bordered rounded-0"
      size="sm"
      ref={forwardRef}
    >
      <thead className="table-secondary">
        <tr className="d-flex">
          <th className="col-1">ID</th>
          <th className="col-1">Terminal ID</th>
          <th className="col-2">IP</th>
          <th className="col-5">Log</th>
          <th className="col-2">Date</th>
          <th className="col-1">Image</th>
        </tr>
      </thead>
      <tbody>
        {props.cameras?.map((camera, index) => (
          <tr className="d-flex" key={index}>
            <td className="col-1">{camera.logId}</td>
            <td className="col-1">{camera.terminalID}</td>
            <td className="col-2">{camera.ip}</td>
            <td style={{ whiteSpace: "normal", wordWrap: "break-word" }} className="col-5">
              {camera.logMsg}
            </td>
            <td className="col-2">{new Date(camera.incidentDate).toLocaleString()}</td>

            <td className="col-1">
              <img
                alt={camera.terminalID + "image"}
                src={`data:image/jpeg;base64,${camera.imgBytes}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
);

export default BlurredCameraTable;

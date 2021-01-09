import React, { forwardRef } from "react";
import { Table } from "react-bootstrap";
import IIssue from "../../../Dtos/IIssue";

interface IDetailsTableProps {
  issues: IIssue[] | undefined;
}
const DetailsTable = forwardRef<any, IDetailsTableProps>((props, forwardRef) => (
  <Table responsive bordered hover className="mt-4 rounded-0" size="sm" ref={forwardRef}>
    <thead>
      <tr className="table-secondary d-flex">
        <th className="col-1">Terminal ID</th>
        <th className="col-1">IP</th>
        <th className="col-5">Issue</th>
        <th className="col-2">Incident Date</th>
        <th className="col-2">Updated Date</th>
        <th className="col-1">Status</th>
      </tr>
    </thead>
    <tbody>
      {props?.issues?.map((issue, index) => (
        <tr className="d-flex" key={index}>
          <td className="col-1">{issue.terminalID}</td>
          <td className="col-1">{issue.ip}</td>
          <td style={{ whiteSpace: "normal", wordWrap: "break-word" }} className="col-5">
            {issue.title}
          </td>
          <td className="col-2">{issue.updatedDate}</td>
          <td className="col-2">{issue.updatedDate}</td>
          <td className="col-1">
            <span
              className={
                issue.status === "open"
                  ? "text-warning px-2 py-1 rounded-0"
                  : "text-success px-2 py-1 rounded-0"
              }
            >
              {issue.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
));

export default DetailsTable;

import React, { forwardRef } from "react";
import { Table, Button } from "react-bootstrap";
import { useHistory } from "react-router";

import { IBranch } from "../../../../Dtos/IBranch";

interface IViewBranchTableProps {
  branchData: IBranch[] | undefined;
}

const ViewBranchTable = forwardRef<HTMLTableElement, IViewBranchTableProps>((props, forwardRef) => {
  const { branchData } = props;
  const history = useHistory();
  return (
    <Table responsive bordered hover className="mt-4 rounded-0" size="sm" ref={forwardRef}>
      <thead className="table-secondary">
        <tr>
          <th>Branch Code</th>
          <th>Branch Name</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {branchData?.map((branch, index) => (
          <tr key={index}>
            <td>{branch.branchCode}</td>
            <td>{branch.branchName}</td>
            <td>{branch.emails} </td>
            <td>
              <Button
                onClick={() => history.push("/branch/addbranch", branch.branchId)}
                variant="outline-dark"
                size="sm"
                className="rounded-0"
              >
                <i className="mdi mdi-file-edit align-middle" />
                <span className="align-middle"> Detail / Edit </span>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

export default ViewBranchTable;

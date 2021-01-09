import React, { forwardRef } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

import { IPrivileges } from "../../../Dtos/IRole";
import * as ApplicationStore from "../../../store/index";

interface IRolePrivilegeTableProps {
  role: string;
  privileges: IPrivileges[];
  onEditClick: (privilegeId: number) => void;
  onDeleteClick: (privilegeId: number) => void;
  canEdit: boolean;
}

const RolePrivilegeTable = forwardRef<HTMLTableElement, IRolePrivilegeTableProps>(
  ({ role, privileges, onEditClick, onDeleteClick, canEdit }, forwardRef) => {
    const loading = useSelector((state: ApplicationStore.ApplicationState) => state.roles?.loading);
    return (
      <Table responsive hover bordered className="rounded-0" size="sm" ref={forwardRef}>
        <thead>
          <tr className=" table-secondary">
            <th>Role</th>
            <th>Privilege</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {privileges.map((privilege) => (
            <tr key={privilege.id}>
              <td>{role}</td>
              <td>{privilege.privilege}</td>
              <td>
                <Button
                  className="rounded-0 mr-2"
                  onClick={() => onEditClick(privilege.id)}
                  disabled={canEdit}
                  variant="outline-dark"
                >
                  <i className="mdi mdi-account-edit-outline align-middle" />
                  <span className="align-middle px-1">Edit</span>
                </Button>
                <Button
                  onClick={() => onDeleteClick(privilege.id)}
                  disabled={canEdit || loading}
                  className="rounded-0"
                  variant="outline-danger"
                >
                  <i className="mdi mdi-delete-outline align-middle" />
                  <span className="align-middle px-1">Delete</span>
                  {loading ? <Spinner animation="grow" size="sm" variant="danger" /> : null}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);

export default RolePrivilegeTable;

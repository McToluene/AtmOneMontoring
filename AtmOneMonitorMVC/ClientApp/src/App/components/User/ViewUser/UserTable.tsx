import React, { ChangeEvent, forwardRef } from "react";
import { Table, Form, Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

import { IUsers } from "../../../../Dtos/IUsers";
import * as ApplicationStore from "../../../../store/index";
import { useHistory } from "react-router";

interface IUserTableProps {
  usersData: IUsers[] | undefined;
  onApproveHandle: (userId: number) => void;
  onCheckBoxChange: (event: ChangeEvent<HTMLInputElement>) => void;
  canEdit: boolean;
}

const UserTable = forwardRef<HTMLTableElement, IUserTableProps>(
  ({ usersData, onApproveHandle, onCheckBoxChange, canEdit }, forwardRef) => {
    const history = useHistory();
    const loading = useSelector((state: ApplicationStore.ApplicationState) => state.users?.loading);

    return (
      <Table responsive hover bordered className="mt-4 rounded-0" size="sm" ref={forwardRef}>
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>FullName</th>
            <th>RoleName</th>
            <th>Email</th>
            <th>Created By</th>
            <th>Active</th>
            <th>Approve Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usersData?.map((user, index) => (
            <tr key={index}>
              <td>{user.userID}</td>
              <td>{user.userName}</td>
              <td>{user.fullName}</td>
              <td>{user.roleName}</td>
              <td>{user.email}</td>
              <td>{user.createdBy}</td>
              <td>
                <Form.Check custom readOnly type="checkbox" checked={user.status} label="" />
              </td>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    onChange={onCheckBoxChange}
                    name={user.userName}
                    checked={user.approved}
                    type="checkbox"
                    className="custom-control-input"
                    id={user.userName}
                  />
                  <label className="custom-control-label" htmlFor={user.userName}></label>
                </div>
              </td>
              <td>
                <Button
                  block
                  className="rounded-0"
                  disabled={canEdit || loading}
                  onClick={() => onApproveHandle(user.userID)}
                  variant="outline-success"
                  size="sm"
                >
                  <i className="mdi mdi-check-decagram align-middle" />
                  <span className="align-middle px-1">Approve </span>

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
              </td>
              <td>
                <Button
                  block
                  className="rounded-0"
                  onClick={() => history.push("/user/edit", user.userID)}
                  variant="outline-dark"
                  size="sm"
                >
                  <i className="mdi mdi-account-edit-outline align-middle" />
                  <span className="align-middle px-1">Edit </span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);

export default UserTable;

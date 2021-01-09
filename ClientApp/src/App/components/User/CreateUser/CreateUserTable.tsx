import React, { FunctionComponent } from "react";
import { ILDAPUser } from "../../../../Dtos/IUsers";
import { Table } from "react-bootstrap";

interface ICreateUserTableProps {
  users: ILDAPUser[];
  onCheckBoxHandle: (index: number, user: ILDAPUser) => void;
}

const CreateUserTable: FunctionComponent<ICreateUserTableProps> = ({ users, onCheckBoxHandle }) => {
  return (
    <Table responsive bordered hover className="mt-3 rounded-0" size="sm">
      <thead>
        <tr className="table-secondary">
          <th>Select</th>
          <th>Username</th>
          <th>Fullname</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user, index) => (
          <tr key={index}>
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  name="select"
                  checked={user.isSelected}
                  type="checkbox"
                  onChange={() => onCheckBoxHandle(index, user)}
                  className="custom-control-input"
                  id={`selected-${index}`}
                />
                <label className="custom-control-label" htmlFor={`selected-${index}`}></label>
              </div>
            </td>
            <td>{user.userName}</td>
            <td>{user.fullName}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CreateUserTable;

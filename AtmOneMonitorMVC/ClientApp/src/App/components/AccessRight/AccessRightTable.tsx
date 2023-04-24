import React, { forwardRef } from "react";
import { ChangeEvent, useCallback, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { IAccessRight } from "../../../Dtos/IAccessRight";

interface IAccessRightTableProps {
  tableData: IAccessRight[];
  onCheckBoxHandle: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
}

const AccessRightTable = forwardRef<HTMLTableElement, IAccessRightTableProps>(
  ({ tableData, onCheckBoxHandle }, forwardRef) => {
    const [state, setState] = useState({
      rights: [] as IAccessRight[],
    });

    const setRights = useCallback(() => {
      if (tableData) {
        setState({ rights: tableData });
      }
    }, [tableData, setState]);

    useEffect(() => {
      if (tableData) setRights();
    }, [tableData, setRights]);

    return (
      <Table responsive bordered hover className="mt-4 rounded-0" size="sm" ref={forwardRef}>
        <thead>
          <tr className="table-secondary">
            <th>S/N</th>
            <th>Rolename</th>
            <th>Privilege</th>
            <th>Add</th>
            <th>Edit</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {state.rights.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data.roleName} </td>
              <td>{data.privilegeName}</td>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    name="add"
                    checked={data.add ? data.add : false}
                    type="checkbox"
                    onChange={(event) => onCheckBoxHandle(event, index)}
                    className="custom-control-input"
                    id={`add-${index}`}
                  />
                  <label className="custom-control-label" htmlFor={`add-${index}`}></label>
                </div>
              </td>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    name="edit"
                    checked={data.update ? data.update : false}
                    type="checkbox"
                    onChange={(event) => onCheckBoxHandle(event, index)}
                    className="custom-control-input"
                    id={`edit-${index}`}
                  />
                  <label className="custom-control-label" htmlFor={`edit-${index}`}></label>
                </div>
              </td>
              <td>
                <div className="custom-control custom-checkbox">
                  <input
                    name="view"
                    checked={data.view ? data.view : false}
                    type="checkbox"
                    onChange={(event) => onCheckBoxHandle(event, index)}
                    className="custom-control-input"
                    id={`view-${index}`}
                  />
                  <label className="custom-control-label" htmlFor={`view-${index}`}></label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);

export default AccessRightTable;

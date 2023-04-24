import React, { forwardRef } from "react";
import { useHistory } from "react-router";
import { Table, Button } from "react-bootstrap";

import { IVendorConfig } from "../../../../Dtos/IVendor";

interface IViewVendorConfigTableProps {
  vendorConfigs: IVendorConfig[];
}

const ViewVendorConfigTable = forwardRef<HTMLTableElement, IViewVendorConfigTableProps>(
  (props, forwardRef) => {
    const history = useHistory();
    return (
      <Table
        responsive
        className="table-hover mt-3 table-bordered rounded-0"
        size="sm"
        ref={forwardRef}
      >
        <thead className="table-secondary">
          <tr>
            <th>AppID</th>
            <th>Config Name</th>
            <th>Vendor</th>
            <th>Image Path</th>
            <th>File Extension</th>
            <th>ATM Log Path</th>
            <th>Extension Filter</th>
            <th>Eject Mode</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.vendorConfigs?.map((vendorConfig, index) => (
            <tr key={index}>
              <td>{vendorConfig.appId}</td>
              <td>{vendorConfig.vendorConfigName}</td>
              <td>{vendorConfig.vendorName}</td>
              <td>{vendorConfig.imagePath}</td>
              <td>{vendorConfig.imageFilter}</td>
              <td>{vendorConfig.atmLogPath}</td>
              <td>{vendorConfig.atmLogFilter}</td>
              <td>{vendorConfig.ejectMode}</td>
              <td>
                <Button
                  className="rounded-0"
                  size="sm"
                  onClick={() =>
                    history.push("/configuration/vendorconfiguration", vendorConfig.vendorConfigId)
                  }
                  variant="outline-dark"
                >
                  <i className="mdi mdi-file-edit-outline align-middle" />
                  <span className="align-middle"> Detail/Edit</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
);
export default ViewVendorConfigTable;

import React, { FunctionComponent } from "react";
import { Table, Image } from "react-bootstrap";
import { useHistory } from "react-router";
import { IBlurredTerminal } from "../../../Dtos/ITerminal";

interface IMinuteBlurredCameraProps {
  cameras: IBlurredTerminal[];
}

const MinuteBlurredCamera: FunctionComponent<IMinuteBlurredCameraProps> = (props) => {
  const history = useHistory();
  return (
    <Table responsive hover bordered className="rounded-0" size="sm">
      <thead className="table-secondary">
        <tr>
          <th>Terminal ID</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {props.cameras?.map((camera, index) => (
          <tr key={index} onClick={() => history.push("/logs/blurredcameras", camera.terminalID)}>
            <td>{camera.terminalID}</td>
            <td>
              <Image
                alt={camera.terminalID + "image"}
                src={`data:image/jpeg;base64,${camera.imgBytes}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MinuteBlurredCamera;

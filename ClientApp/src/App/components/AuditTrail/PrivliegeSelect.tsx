import React, { Fragment, useState, useEffect, useCallback, FunctionComponent } from "react";
import { Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import { IPrivileges } from "../../../Dtos/IRole";

interface IPrivilegeSelectProps {
  privilege: number;
  setPrivilege: (value: number) => void;
  disable?: boolean;
}

const PrivilegeSelect: FunctionComponent<IPrivilegeSelectProps> = (props) => {
  const { privilege, setPrivilege, disable } = props;
  const globalPrivileges = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.privileges
  );

  const dispatch = useDispatch();
  const [privileges, setprivileges] = useState<IPrivileges[]>([]);

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getPrivileges());
  }, [dispatch]);

  const setPrivilegesState = useCallback(() => {
    if (globalPrivileges) setprivileges(globalPrivileges);
  }, [globalPrivileges, setprivileges]);

  useEffect(() => {
    setPrivilegesState();
  }, [globalPrivileges, setPrivilegesState]);

  return (
    <Fragment>
      <Form.Label className="mx-2">Privilege</Form.Label>
      <Form.Group controlId="privilege">
        <Form.Control
          disabled={disable}
          className="rounded-0"
          onChange={(event) => {
            setPrivilege(parseInt(event.target.value));
          }}
          value={privilege || 0}
          as="select"
          custom
        >
          <option value={0}>Select</option>
          {privileges?.map((privilege) => (
            <option key={privilege.id} value={privilege.id}>
              {privilege.privilege}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Fragment>
  );
};

export default PrivilegeSelect;

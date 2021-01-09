import React, {
  Fragment,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Form, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import { IRolePrivileges } from "../../../Dtos/IRole";

interface IRoleSelectProps {
  role: number;
  setRole: (role: number) => void;
}

const RoleSelect: FunctionComponent<IRoleSelectProps> = (props) => {
  const { role, setRole } = props;
  const dispatch = useDispatch();

  const globalRoles = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.rolesPrivileges
  );

  const [roles, setRoles] = useState<IRolePrivileges[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRoles = useCallback(() => {
    setLoading(true);
    dispatch(RoleStore.actionCreators.getRoles());
  }, [setLoading, dispatch]);

  useEffect(() => {
    fetchRoles();
  }, [dispatch, fetchRoles]);

  const onRoles = useCallback(() => {
    if (globalRoles) {
      setRoles(globalRoles);
      setLoading(false);
    }
  }, [globalRoles, setRoles]);

  useEffect(() => {
    onRoles();
  }, [globalRoles, onRoles]);

  return (
    <Fragment>
      <Form.Label className="mr-2">Role</Form.Label>
      <Form.Group controlId="formRole">
        <Form.Control
          className="rounded-0"
          onChange={(event) => {
            setRole(parseInt(event.target.value));
          }}
          value={role || 0}
          as="select"
          disabled={loading}
          custom
        >
          <option value={0}>Select</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.rolename}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {loading ? <Spinner animation="border" variant="success" /> : null}
    </Fragment>
  );
};

export default RoleSelect;

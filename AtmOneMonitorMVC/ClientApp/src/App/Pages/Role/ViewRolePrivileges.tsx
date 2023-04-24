import React, {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  FunctionComponent,
  Fragment,
} from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";

import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import RolePrivilegeTable from "../../components/Privileges/RolePrivilegesTable";
import { IPrivileges } from "../../../Dtos/IRole";

interface IViewRolePrivilegesProps {
  onEditClick: (privilegeId: number, roleId: number) => void;
  canEdit: boolean;
}

const ViewRolePrivileges: FunctionComponent<IViewRolePrivilegesProps> = ({
  onEditClick,
  canEdit,
}) => {
  const { addToast } = useToasts();
  const roles = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.rolesPrivileges
  );

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.roles?.loading);

  const response = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.responseAdd
  );

  const dispatch = useDispatch();

  const [state, setState] = useState({
    index: 0,
    privileges: [] as IPrivileges[],
    rolename: "",
  });

  const getPrivilege = useCallback(() => {
    const privileges = roles?.[state.index]?.privilege;
    const rolename = roles?.[state.index]?.rolename;
    if (privileges && rolename) setState({ ...state, privileges, rolename });
  }, [roles, state]);

  const onChangeHandle = (event: ChangeEvent<any>) => {
    if (event.target.value !== "Select")
      setState({ ...state, index: parseInt(event.target.value) });
  };

  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getRoles());
  }, [dispatch, state.index]);

  useEffect(() => {
    getPrivilege();
  }, [roles, state.index]);

  const onEditClickHandler = (privilegeId: number) => {
    onEditClick(privilegeId, state.index);
  };

  const onDeleteClickHandler = (privilegeId: number) => {
    const value: {
      roleId: number;
      privilegeId: number;
    } = {
      roleId: state.index + 1,
      privilegeId,
    };
    setIsDelete(true);
    dispatch(RoleStore.actionCreators.deleteRolePrivlege(value));
  };

  useEffect(() => {
    if (!loading && isDelete) {
      if (response) {
        addToast("Successfully deleted privilege for role!", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch(RoleStore.actionCreators.getRoles());
      } else {
        addToast("Failed to delete privilege for role!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setIsDelete(false);
      dispatch({ type: "SET_UPDATED", payload: false });
    }
  }, [loading, response, dispatch]);

  return (
    <Fragment>
      <Row>
        <Col>
          <Row>
            <Col sm="3">
              <Form.Label>Role</Form.Label>
              <Form.Group controlId="role">
                <Form.Control
                  className="rounded-0"
                  onChange={onChangeHandle}
                  value={state.index}
                  as="select"
                  custom
                >
                  {roles?.map((role, index) => (
                    <option key={role.id} value={index}>
                      {role.rolename}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <RolePrivilegeTable
                onDeleteClick={onDeleteClickHandler}
                onEditClick={onEditClickHandler}
                canEdit={canEdit}
                role={state.rolename}
                privileges={state.privileges}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ViewRolePrivileges;

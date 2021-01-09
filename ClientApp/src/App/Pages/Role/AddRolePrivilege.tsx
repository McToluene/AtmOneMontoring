import React, {
  useEffect,
  FormEvent,
  useState,
  useCallback,
  FunctionComponent,
  Fragment,
} from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";

import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import RoleSelect from "../../components/Common/RoleSelect";
import { IPrivileges } from "../../../Dtos/IRole";

interface IAddRolePrivilegeProps {
  role: number;
  privilege: number;
  canEdit: boolean;
  isEdit: boolean;
  canAdd: boolean;
  setRole: (role: number) => void;
  setPrivilege: (privilege: number) => void;
}

const AddRolePrivilege: FunctionComponent<IAddRolePrivilegeProps> = ({
  canEdit,
  isEdit,
  role,
  privilege,
  setPrivilege,
  setRole,
  canAdd,
}) => {
  const globalPrivileges = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.privileges
  );

  const { addToast } = useToasts();
  const [prevPrivilege, setPrevPrivilege] = useState(0);
  const [isAddEdit, setIsAddEdit] = useState(false);

  useEffect(() => {
    if (isEdit) setIsAddEdit(canEdit);
    else setIsAddEdit(canAdd);
  }, [isEdit, setIsAddEdit, canEdit, canAdd]);

  useEffect(() => {
    if (isEdit && prevPrivilege <= 0) setPrevPrivilege(privilege);
  }, [isEdit, prevPrivilege, setPrevPrivilege]);

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.roles?.loading);

  const response = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.responseAdd
  );

  const [privileges, setPrivileges] = useState<IPrivileges[]>([]);

  const onPrivileges = useCallback(() => {
    if (globalPrivileges) setPrivileges(globalPrivileges);
  }, [globalPrivileges, setPrivileges]);

  useEffect(() => {
    if (globalPrivileges !== undefined) onPrivileges();
  }, [globalPrivileges, onPrivileges]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getPrivileges());
  }, [dispatch]);

  // state to know if the add function is for single or multi
  const [isSingle, setIsSingle] = useState(false);

  useEffect(() => {
    if (isSingle && !loading) {
      if (response) {
        addToast("Privilege succesfully added to role!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Failed to add privilege for role!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setIsSingle(false);
      setPrevPrivilege(0);
    }
  }, [isSingle, loading, response, addToast]);

  const onSubmitHandle = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (isEdit) {
      const value = {
        roleId: role,
        privilegeId: privilege,
        prevPrivilegeId: prevPrivilege,
      };
      dispatch(RoleStore.actionCreators.updateRolePrivilege(value));
    } else {
      const value = {
        roleId: role,
        privilegeId: privilege,
      };
      dispatch(RoleStore.actionCreators.addRolePrivilege(value));
    }
    setIsSingle(true);
  };

  return (
    <Fragment>
      <Row>
        <Col sm={5}>
          <Form onSubmit={onSubmitHandle}>
            <RoleSelect role={role} setRole={setRole} />
            <Form.Label>Privilege</Form.Label>
            <Form.Group controlId="privilege">
              <Form.Control
                className="rounded-0"
                onChange={(event) => setPrivilege(parseInt(event.target.value))}
                value={privilege}
                as="select"
                custom
              >
                {privileges?.map((privilege) => (
                  <option key={privilege.id} value={privilege.id}>
                    {privilege.privilege}
                  </option>
                ))}
              </Form.Control>
              <Button
                type="submit"
                className="mt-5 rounded-0"
                disabled={isAddEdit || loading}
                size="sm"
                variant="outline-success"
              >
                {isEdit ? "UPDATE" : "ADD"}

                {loading ? (
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                ) : null}
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddRolePrivilege;

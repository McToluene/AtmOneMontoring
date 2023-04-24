import React, { useEffect, useState, FunctionComponent } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";

import * as RoleStore from "../../../store/RoleStore";
import * as ApplicationStore from "../../../store/index";
import AddRemovePrivileges from "../../components/Privileges/AddRemovePrivileges";
import { IPrivileges } from "../../../Dtos/IRole";
import RoleSelect from "../../components/Common/RoleSelect";

interface IAddMultiPrivilegesProps {
  canAdd: boolean;
}

const AddMultiPrivileges: FunctionComponent<IAddMultiPrivilegesProps> = ({ canAdd }) => {
  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.roles?.loading);
  const [isMultiAdd, setIsMultiAdd] = useState(false);
  const { addToast } = useToasts();

  const response = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.reponseAddRemove
  );

  const [role, setRole] = useState(0);

  const dispatch = useDispatch();

  const onSubmitHandle = (rolePrivileges: IPrivileges[], removedPrivileges: IPrivileges[]) => {
    if (role) {
      const remove: any = [];
      const value: any = [];

      removedPrivileges.forEach((privlege) =>
        remove.push({ roleId: role, privilegeId: privlege.id })
      );

      rolePrivileges.forEach((privlege) => value.push({ roleId: role, privilegeId: privlege.id }));
      const data = {
        removedPrivileges: remove,
        rolePrivileges: value,
      };

      dispatch(RoleStore.actionCreators.addRemoveRolePrivileges(data));
      setIsMultiAdd(true);
    }
  };

  useEffect(() => {
    if (isMultiAdd && role > 0 && !loading) {
      if (response) {
        addToast("Privileges successfully added/removed!", {
          appearance: "success",
          autoDismiss: true,
        });
        dispatch({ type: "ADD_ROLE_PRIVILEGE", payload: false });
        dispatch(RoleStore.actionCreators.getRoles());
      } else {
        addToast("Failed add/remove privileges!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      setIsMultiAdd(false);
    }
  }, [isMultiAdd, response, dispatch, addToast]);

  return (
    <Row>
      <Col>
        <Row>
          <Col sm="5">
            <RoleSelect role={role} setRole={setRole} />
          </Col>
        </Row>
        <Row>
          <AddRemovePrivileges canAdd={canAdd} role={role} onSubmitHandle={onSubmitHandle} />
        </Row>
      </Col>
    </Row>
  );
};

export default AddMultiPrivileges;

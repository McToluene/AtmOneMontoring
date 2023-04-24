import * as React from "react";
import { FunctionComponent, useEffect, useState, useCallback } from "react";
import {
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Button,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import * as ApplicationStore from "../../../store/index";
import * as RoleStore from "../../../store/RoleStore";
import { IPrivileges } from "../../../Dtos/IRole";

interface IAddRemovePrivilegesProps {
  role: number;
  onSubmitHandle: (rolePrivileges: IPrivileges[], removedPrivileges: IPrivileges[]) => void;
  canAdd: boolean;
}

const AddRemovePrivileges: FunctionComponent<IAddRemovePrivilegesProps> = ({
  role,
  onSubmitHandle,
  canAdd,
}) => {
  const privileges = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.privileges
  );

  const rolesPrivileges = useSelector(
    (state: ApplicationStore.ApplicationState) => state.roles?.rolesPrivileges
  );

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.roles?.loading);

  const [allowRemove, setAllowRemove] = useState(true);
  useEffect(() => {
    if (role === 1) setAllowRemove(false);
    else setAllowRemove(true);
  }, [role]);

  const [state, setState] = useState({
    filtered: [] as IPrivileges[],
    rolePrivileges: [] as IPrivileges[],
    removedPrivileges: [] as IPrivileges[],
  });

  const filterRolePrivileges = useCallback(() => {
    if (role !== 0) {
      const selectedRole = rolesPrivileges?.filter((rolePrivilege) => rolePrivilege.id == role);
      const rolePrivileges = selectedRole?.[0]?.privilege;

      if (rolePrivileges) setState({ ...state, rolePrivileges });
    }
  }, [role, rolesPrivileges, state]);

  const filterPrivilege = () => {
    const rolePrivileges = state.rolePrivileges;

    const filtered = privileges?.filter(
      (priv) => !rolePrivileges?.find((rolePriv) => rolePriv.id === priv.id)
    );

    if (filtered) setState({ ...state, filtered });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(RoleStore.actionCreators.getPrivileges());
  }, [dispatch]);

  useEffect(() => {
    filterRolePrivileges();
  }, [role, rolesPrivileges]);

  useEffect(() => {
    filterPrivilege();
  }, [privileges, state.rolePrivileges]);

  const onAddHandle = (value: IPrivileges) => {
    if (role !== 0) {
      const filtered = state.filtered?.filter((privilege) => privilege.id !== value.id);
      state.rolePrivileges.push(value);
      setState({ ...state });
      if (filtered) setState({ ...state, filtered });
    }
  };

  const onRemoveHandle = (value: IPrivileges) => {
    if (allowRemove) {
      const selectedIndex = state.rolePrivileges?.indexOf(value);
      const removedPrivileges = state.rolePrivileges?.splice(selectedIndex, 1);

      state.removedPrivileges.push(removedPrivileges?.[0]);
      setState({ ...state, filtered: state.filtered.concat(value) });
    }
  };

  const onAddAllClick = () => {
    if (role !== 0) {
      const filtered = state.filtered.splice(0, state.filtered.length);
      state.rolePrivileges.push(...filtered);
      setState({ ...state });
    }
  };

  const onRemoveAllClick = () => {
    const removedPrivileges = state.rolePrivileges?.splice(0, state.rolePrivileges.length);
    state.filtered.push(...removedPrivileges);
    setState({ ...state });
  };

  return (
    <Col>
      <Row>
        <Col sm={5}>
          <div style={{ height: "35vh", overflow: "auto" }} className="border border-secondary">
            <ListGroup className="rounded-0">
              {state.filtered?.map((privilege, index) => (
                <OverlayTrigger
                  key={index}
                  placement="left"
                  overlay={
                    <Tooltip id={`tooltip-${index}`}>
                      Click on privilege to
                      <strong className="text-success"> add</strong>.
                    </Tooltip>
                  }
                >
                  <Button
                    variant="outline-success"
                    as={ListGroupItem}
                    onClick={() => onAddHandle(privilege)}
                    className="list-group-flush list-group-item-action"
                  >
                    {privilege.privilege}
                  </Button>
                </OverlayTrigger>
              ))}
            </ListGroup>
          </div>
        </Col>
        <Col sm={1} className="align-self-center">
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id={`tooltip-add-all`}>
                Click to<strong className="text-success"> add</strong> all privileges.
              </Tooltip>
            }
          >
            <Button onClick={onAddAllClick} variant="outline-success" className="rounded-0">
              <i className="mdi mdi-chevron-triple-right px-1 align-middle" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="left"
            overlay={
              <Tooltip id={`tooltip-remove-all`}>
                Click to<strong className="text-danger"> remove</strong> all privileges.
              </Tooltip>
            }
          >
            <Button onClick={onRemoveAllClick} variant="outline-danger" className="rounded-0 mt-1">
              <i className="mdi mdi-chevron-triple-left px-1 align-middle" />
            </Button>
          </OverlayTrigger>
        </Col>
        <Col sm={5}>
          <div style={{ height: "35vh", overflow: "auto" }} className="border border-secondary">
            <ListGroup className="rounded-0">
              {state.rolePrivileges?.map((privilege, index) => (
                <OverlayTrigger
                  key={index}
                  placement="right"
                  overlay={
                    <Tooltip id={`tooltip-${index}`}>
                      Click on privilege to
                      <strong className="text-danger"> remove</strong>.
                    </Tooltip>
                  }
                >
                  <Button
                    variant="outline-danger"
                    onClick={() => onRemoveHandle(privilege)}
                    as={ListGroupItem}
                    className="list-group-flush list-group-item-action"
                  >
                    {privilege.privilege}
                  </Button>
                </OverlayTrigger>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Button
            disabled={canAdd || loading}
            className="rounded-0"
            onClick={() => onSubmitHandle(state.rolePrivileges, state.removedPrivileges)}
            variant="outline-success"
            size="sm"
          >
            <span className="align-middle px-3">SAVE</span>
            {loading ? (
              <Spinner
                as="span"
                variant="success"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
          </Button>
        </Col>
      </Row>
    </Col>
  );
};

export default AddRemovePrivileges;

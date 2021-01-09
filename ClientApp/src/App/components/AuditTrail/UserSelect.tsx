import React, { useState, useEffect, useCallback, Fragment, FunctionComponent } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import * as ApplicationStore from "../../../store/index";
import * as UserStore from "../../../store/UsersStore";
import { IUsers } from "../../../Dtos/IUsers";

interface IUserSelectProps {
  user: number;
  setUser: (value: number) => void;
}

const UserSelect: FunctionComponent<IUserSelectProps> = (props) => {
  const { user, setUser } = props;
  const globalUsers = useSelector(
    (state: ApplicationStore.ApplicationState) => state.users?.users.data
  );
  const dispatch = useDispatch();

  const [users, setUsers] = useState<IUsers[]>([]);

  useEffect(() => {
    dispatch(UserStore.actionCreators.getUsers());
  }, [dispatch]);

  const setUsersState = useCallback(() => {
    if (globalUsers) setUsers(globalUsers);
  }, [globalUsers, setUsers]);

  useEffect(() => {
    setUsersState();
  }, [globalUsers, setUsersState]);

  return (
    <Fragment>
      <Form.Label className="mr-2">Username</Form.Label>
      <Form.Group controlId="username">
        <Form.Control
          className="rounded-0"
          onChange={(event) => {
            setUser(parseInt(event.target.value));
          }}
          value={user || 0}
          as="select"
          custom
        >
          <option value={0}>Select</option>
          {users?.map((user, index) => (
            <option key={index} value={user.userID}>
              {user.userName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Fragment>
  );
};

export default UserSelect;

import React, { FunctionComponent, Fragment } from "react";
import { Form, Button, Col } from "react-bootstrap";
import RoleSelect from "../../Common/RoleSelect";
import AllowPaging from "../../Common/AllowPaging";

interface ICreateUserTableTopProps {
  username: string;
  setUsername: (username: string) => void;
  onSearchClick: () => void;
  role: number;
  setRole: (role: number) => void;
  allowPaging: boolean;
  setAllowPaging: (value: boolean) => void;
  onSaveClick: () => void;
  isSaveEnabled: boolean;
  onAllowChange: () => void;
}

const CreateUserTableTop: FunctionComponent<ICreateUserTableTopProps> = (props) => {
  const {
    onSearchClick,
    role,
    setRole,
    setUsername,
    username,
    allowPaging,
    onSaveClick,
    isSaveEnabled,
    onAllowChange,
  } = props;

  return (
    <Fragment>
      <AllowPaging allowPaging={allowPaging} onAllowChange={onAllowChange} />
      <Form as={Col} sm="auto" inline>
        <Form.Label className="mr-2">Username</Form.Label>
        <Form.Group controlId="username" className="mr-2">
          <Form.Control
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            size="sm"
            name="domain"
            className="rounded-0"
            type="text"
            placeholder="Enter Username"
          />
        </Form.Group>
        <Button
          as={Col}
          onClick={onSearchClick}
          sm="auto"
          size="sm"
          variant="outline-info"
          className="mr-5 rounded-0"
        >
          <i className="mdi mdi-magnify align-middle " />
          <span className="align-middle px-1">Search </span>
        </Button>
        <RoleSelect role={role} setRole={setRole} />
        <Button
          disabled={isSaveEnabled}
          as={Col}
          onClick={onSaveClick}
          sm="auto"
          size="sm"
          variant="outline-success"
          className="ml-2 rounded-0"
        >
          <i className="mdi mdi-content-save align-middle " />
          <span className="align-middle px-1"> Save </span>
        </Button>
      </Form>
    </Fragment>
  );
};

export default CreateUserTableTop;

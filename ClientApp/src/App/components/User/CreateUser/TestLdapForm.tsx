import React, {
  ChangeEvent,
  FunctionComponent,
  MouseEvent,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Form, Col, FormControl, Button, Spinner } from "react-bootstrap";

import * as ApplicationStore from "../../../../store/index";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

interface ITestLdapState {
  ldapString: string;
  domain: string;
  filter: string;
  username: string;
  password: string;
}

interface ITestLdapFormProps {
  formState: ITestLdapState;
  testLoading: boolean;
  setFormState: (form: ITestLdapState) => void;
  onTestClickHandler: (event: MouseEvent<HTMLElement>) => void;
  errors: { domain: string; ldapString: string };
  setErrors: (error: { domain: string; ldapString: string }) => void;
}

const TestLdapForm: FunctionComponent<ITestLdapFormProps> = (props) => {
  const { formState, setFormState, onTestClickHandler, errors, setErrors, testLoading } = props;

  const { addToast } = useToasts();

  const onChangeHandle = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value, name } = event.target;

    switch (name) {
      case "ldapstring":
        setErrors({
          ...errors,
          ldapString: value ? "" : "Please ldap is required!",
        });
        setFormState({ ...formState, ldapString: value });
        break;
      case "domain":
        setErrors({
          ...errors,
          domain: value ? "" : "Please domain is required!",
        });
        setFormState({ ...formState, domain: value });
        break;
      case "username":
        setFormState({ ...formState, username: value });
        break;
      case "password":
        setFormState({ ...formState, password: value });
        break;
    }
  };

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.users?.loading);

  const isConnected = useSelector(
    (state: ApplicationStore.ApplicationState) => state.users?.isConnected
  );

  const [isTestClicked, setIsTestClicked] = useState(false);

  const connectionMessage = useCallback(() => {
    if (isTestClicked) {
      if (isConnected) {
        addToast("Successfully connected!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Failed to connect!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  }, [isTestClicked, isConnected, addToast]);

  useEffect(() => {
    if (!testLoading) {
      connectionMessage();
    }
  }, [testLoading, connectionMessage]);

  return (
    <form>
      <Form.Row className="align-items-center">
        <Form.Group as={Col} md={3} className="mr-3" controlId="ldap">
          <Form.Label className="mr-2">LDAP</Form.Label>
          <Form.Control
            name="ldapstring"
            className="rounded-0"
            size="sm"
            onChange={onChangeHandle}
            value={formState?.ldapString || ""}
            type="text"
            placeholder="Enter LDAP"
            isInvalid={errors.ldapString?.length > 0}
          />
          {errors.ldapString?.length > 0 && (
            <FormControl.Feedback type="invalid">
              <small>{errors.ldapString}</small>
            </FormControl.Feedback>
          )}
        </Form.Group>
        <Form.Group as={Col} md={3} className="mr-2" controlId="domain">
          <Form.Label className="mr-2">Domain</Form.Label>
          <Form.Control
            size="sm"
            name="domain"
            onChange={onChangeHandle}
            className="rounded-0"
            value={formState?.domain || ""}
            type="text"
            placeholder="Enter the domain"
            isInvalid={errors.domain?.length > 0}
          />
          {errors.domain?.length > 0 && (
            <FormControl.Feedback type="invalid">
              <small>{errors.domain}</small>
            </FormControl.Feedback>
          )}
        </Form.Group>
        <Col sm={2}>
          <Button
            size="sm"
            block
            disabled={testLoading}
            onClick={(event) => {
              setIsTestClicked(true);
              onTestClickHandler(event);
            }}
            type="submit"
            variant="outline-info"
            className="rounded-0"
          >
            <i className="mdi mdi-lan-connect align-middle " />
            <span className="align-middle px-2"> Test </span>
            {testLoading ? (
              <Spinner
                variant="success"
                animation="border"
                role="status"
                size="sm"
                aria-hidden="true"
              />
            ) : null}
          </Button>
        </Col>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={3} className="mr-3" controlId="user-id">
          <Form.Label className="mr-2">User ID</Form.Label>
          <Form.Control
            name="user-id"
            className="rounded-0"
            size="sm"
            value={formState.username}
            onChange={onChangeHandle}
            type="text"
            placeholder="Enter username"
          />
        </Form.Group>
        <Form.Group as={Col} md={3} className="mr-2" controlId="password">
          <Form.Label className="mr-2">Password</Form.Label>
          <Form.Control
            name="password"
            className="rounded-0"
            size="sm"
            value={formState.password}
            onChange={onChangeHandle}
            type="text"
            placeholder="Enter the password"
          />
        </Form.Group>
      </Form.Row>
    </form>
  );
};

export default TestLdapForm;

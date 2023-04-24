import * as React from "react";
import { useFormik } from "formik";
import { connect, useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FormGroup,
  FormControl,
  Button,
  Spinner,
} from "react-bootstrap";

import { ApplicationState } from "../../../store";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import * as ErrorStore from "../../../store/ErrorStore";
import Logo from "../../../assets/images/atm-one.svg";

type Error = {
  username: string;
  password: string;
};

type LoginProps = AuthenticationStore.AuthenticationState &
  ErrorStore.ErrorState &
  RouteComponentProps<{}> &
  typeof AuthenticationStore.actionCreators;

const Login: React.FunctionComponent<LoginProps> = (props) => {
  const { errors: apiErrors, loading, history, isAuthenticated, user } = props;

  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validate: (values) => {
      const errors = {} as Error;

      if (!values.username) {
        errors.username = "Please username field is required";
      }
      if (!values.password) {
        errors.password = "Please password field is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      props.loginUser(values);
    },
  });

  useEffect(() => {
    if (apiErrors.errors?.title) {
      addToast(apiErrors.errors.title, {
        appearance: "error",
        autoDismiss: true,
      });

      dispatch({ type: "CLEAR_ERRORS" });
    }
    if (user && isAuthenticated) {
      history.push("/dashboard/index");
    }
  }, [addToast, apiErrors, isAuthenticated, history, user]);

  return (
    <div className="login">
      <Container>
        <Row className="justify-content-center mb-3">
          <Col sm={2}>
            <img src={Logo} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm="4">
            <Card className="card-signin justify-content-center rounded-0">
              <Card.Body className="card-body">
                <Card.Header>INTELLIGENT CAMERA</Card.Header>
                <Card.Title className="text-center text-success">LOGIN</Card.Title>
                <form onSubmit={formik.handleSubmit} className="form-signin">
                  <FormGroup className="form-label-group">
                    <FormControl
                      type="text"
                      name="username"
                      id="inputUsername"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      className="form-control"
                      placeholder="Username"
                      autoFocus={true}
                      isInvalid={formik.errors.username ? true : false}
                    />
                    {formik.errors.username && formik.touched.username ? (
                      <FormControl.Feedback type="invalid">
                        {formik.errors.username}
                      </FormControl.Feedback>
                    ) : null}

                    <Form.Label htmlFor="inputUsername">Username</Form.Label>
                  </FormGroup>

                  <FormGroup className="form-label-group">
                    <FormControl
                      type="password"
                      name="password"
                      id="inputPassword"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      className="form-control"
                      placeholder="Password"
                      isInvalid={formik.errors.password && formik.touched.password ? true : false}
                    />
                    {formik.errors.password ? (
                      <FormControl.Feedback type="invalid">
                        {formik.errors.password}
                      </FormControl.Feedback>
                    ) : null}
                    <Form.Label htmlFor="inputPassword">Password</Form.Label>
                  </FormGroup>
                  <Button
                    size="lg"
                    variant="success"
                    className="btn-block text-uppercase mt-4 shadow-2 rounded-0"
                    type="submit"
                    disabled={loading}
                  >
                    LOGIN
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : null}
                  </Button>
                </form>
              </Card.Body>
              <Card.Footer className="text-center">
                <p>&copy; {new Date().getFullYear()} - AtmOne Monitor</p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default connect(
  (state: ApplicationState) => ({
    errors: state.errors,
    ...state.auth,
  }),
  AuthenticationStore.actionCreators
)(Login as any);

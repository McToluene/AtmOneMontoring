import React, {
  FunctionComponent,
  Fragment,
  MouseEvent,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Col, Row, Card, Spinner, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";

import TestLdap from "../../components/User/CreateUser/TestLdap";
import * as ApplicationStore from "../../../store/index";
import * as UserStore from "../../../store/UsersStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import CreateUserTableTop from "../../components/User/CreateUser/CreateUserTableTop";
import { ISearchADUsers } from "../../../Dtos/ITestConnecton";
import { ILDAPUser, IUserCreate } from "../../../Dtos/IUsers";
import CreateUserTable from "../../components/User/CreateUser/CreateUserTable";
import Pagination from "../../components/Pagination/Pagination";
import { isEmpty } from "../../../utils/isEmpty";

interface ITestLdapState {
  ldapString: string;
  domain: string;
  filter: string;
  username: string;
  password: string;
}

interface ICreateUserPaginationState {
  resultPerPage: number;
  currentUsers: ILDAPUser[];
}

interface IOnPageChangedData {
  currentPage: number;
  totalPages: number;
  pageLimit: number;
}

const CreateUser: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const [usermame, setUsermame] = useState("");
  const [role, setRole] = useState(0);
  const [allowPaging, setAllowPaging] = useState(true);
  const [testLoading, setTestLoading] = useState(false);

  const [users, setUsers] = useState<ILDAPUser[]>([]);
  const [selected, setSelected] = useState<ILDAPUser[]>([]);
  const [isSaveClicked, setIsSaveClicked] = useState(false);

  const [state, setState] = useState<ITestLdapState>({
    domain: "",
    ldapString: "",
    username: "",
    password: "",
    filter: "",
  });

  const [paging, setPaging] = useState<ICreateUserPaginationState>({
    resultPerPage: 10,
    currentUsers: [],
  });

  const onTestClickHandle = (event: MouseEvent<HTMLElement>, testDetails: any) => {
    event.preventDefault();
    setTestLoading(true);
    dispatch(UserStore.actionCreators.testConnection(testDetails));
  };

  useEffect(() => {
    dispatch(UserStore.actionCreators.getLdap());
  }, [dispatch]);

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.users?.loading);

  const ldapUsers = useSelector((state: ApplicationStore.ApplicationState) => state.users?.adUsers);

  const isCreated = useSelector(
    (state: ApplicationStore.ApplicationState) => state.users?.isAdded.data
  );

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("createuser"));
    setUserPrivilegeLoading(true);
  }, [dispatch]);

  const unAuthorizedPage = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.denied
  );

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const showMessage = useCallback(() => {
    if (userPrivilegeLoading && isEmpty(rolePrivilege) && unAuthorizedPage) {
      setUserPrivilegeLoading(false);
      history.push("/unauthorized");
    }
  }, [userPrivilegeLoading, unAuthorizedPage, history, rolePrivilege]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  useEffect(() => {
    if (!loading && testLoading) setTestLoading(false);
  }, [loading, testLoading, setTestLoading]);

  const onSearchClickHandler = () => {
    const search: ISearchADUsers = {
      domain: state.domain,
      ldapString: state.ldapString,
      password: state.password,
      userName: state.username,
      userId: usermame,
    };

    dispatch(UserStore.actionCreators.loadADUser(search));
  };

  const onSearchComplete = useCallback(() => {
    if (ldapUsers?.data) setUsers(ldapUsers.data);
  }, [ldapUsers, setUsers]);

  useEffect(() => {
    if (ldapUsers) onSearchComplete();
  }, [ldapUsers, onSearchComplete]);

  const onSaveClick = () => {
    if (users.length > 0 && selected.length > 0) {
      const newUsers: IUserCreate[] = [];
      selected.forEach((user) => {
        const newUser: IUserCreate = {
          email: user.email,
          fullName: user.fullName,
          roleId: role,
          userName: user.userName,
        };
        newUsers.push(newUser);
      });
      saveLdap();
      dispatch(UserStore.actionCreators.addAdUser(newUsers));
      setIsSaveClicked(true);
    }
  };

  const saveLdap = () => {
    const ldap = {
      domain: state.domain,
      ldapString: state.ldapString,
      filter: state.filter,
    };
    dispatch(UserStore.actionCreators.saveLdap(ldap));
  };

  const onCreateMessage = useCallback(() => {
    if (isCreated) {
      addToast("Users successfully added!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed to add all/some of users!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_CREATED", payload: false });
  }, [isCreated, dispatch, addToast]);

  useEffect(() => {
    if (!loading && isSaveClicked) {
      onCreateMessage();
      setIsSaveClicked(false);
    }
  }, [loading, isSaveClicked, onCreateMessage, setIsSaveClicked]);

  const handlePageChanged = ({ currentPage, totalPages, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentUsers = users?.slice(offSet, offSet + pageLimit);
    currentUsers = currentUsers ? currentUsers : [];

    setPaging({
      ...paging,
      currentUsers,
    });
  };

  let tableContent = allowPaging ? paging.currentUsers : users;

  const onCheckBoxHandle = (index: number, user: ILDAPUser) => {
    const newUsers = [...tableContent];
    const value = (newUsers[index].isSelected = !newUsers[index].isSelected);
    if (value) setSelected((selected) => selected.concat(user));
    else {
      const selectedIndex = selected.indexOf(user);
      selected.splice(selectedIndex, 1);
      setSelected(selected);
    }
    if (allowPaging) setPaging({ ...paging, currentUsers: newUsers });
    else setUsers(newUsers);
  };

  const onAllowChange = () => {
    // setAllowPaging(!allowPaging);
  };

  return (
    <Fragment>
      <Col>
        <Row>
          <Col>
            <div className="page-header">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <i className="mdi mdi-account-network text-info mr-2" />
                    User Management
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <i className="mdi mdi-account-plus text-info mr-2" />
                    Create User
                  </li>
                </ol>
              </nav>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header className="container-fluid bg-white">
                <Row>
                  <Col md={10}>
                    <div className="float-left">
                      <i className="mdi mdi-badge-account-alert-outline text-success icon-sm mr-1"></i>
                      <h5 className="d-inline">Active Directory Users</h5>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row className="border-right border-left border-bottom pb-2">
                  <TestLdap
                    state={state}
                    setState={setState}
                    testLoading={testLoading}
                    onTestClick={onTestClickHandle}
                  />
                </Row>
                <Row className="mt-4">
                  <CreateUserTableTop
                    onAllowChange={onAllowChange}
                    isSaveEnabled={role === 0}
                    onSaveClick={onSaveClick}
                    allowPaging={allowPaging}
                    setAllowPaging={setAllowPaging}
                    onSearchClick={onSearchClickHandler}
                    role={role}
                    setRole={setRole}
                    username={usermame}
                    setUsername={setUsermame}
                  />
                  {allowPaging ? (
                    <Form as={Col} sm={3} className="form-inline">
                      <Form.Label className="mr-2">Result per page</Form.Label>
                      <Form.Group controlId="number-pages">
                        <Form.Control
                          className="rounded-0"
                          size="sm"
                          as="select"
                          onChange={(event) =>
                            setPaging({
                              ...paging,
                              resultPerPage: Number(event.target.value),
                            })
                          }
                          value={paging.resultPerPage}
                          custom
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </Form.Control>
                      </Form.Group>
                      <Pagination
                        className="my-1 ml-3"
                        totalRecords={users?.length}
                        pageLimit={paging.resultPerPage}
                        pageNeighbours={0}
                        onPageChanged={handlePageChanged}
                      />
                    </Form>
                  ) : null}
                </Row>

                <Row>
                  <Col sm="auto" className="mt-3">
                    <h4>Total: {loading ? 0 : users?.length}</h4>
                  </Col>
                </Row>
                <Row>
                  <Col sm="auto" className="mt-3">
                    <h6>Count: {selected.length} </h6>
                  </Col>
                </Row>
                {loading ? (
                  <Row className="justify-content-md-center mt-5">
                    <Col sm="auto">
                      <Spinner animation="grow" size="sm" variant="success" />
                    </Col>
                  </Row>
                ) : (
                  <Row className="mt-1">
                    <CreateUserTable onCheckBoxHandle={onCheckBoxHandle} users={tableContent} />
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Fragment>
  );
};
export default CreateUser;

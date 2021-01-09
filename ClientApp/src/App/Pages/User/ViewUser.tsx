import React, {
  FunctionComponent,
  useEffect,
  useState,
  ChangeEvent,
  useCallback,
  useRef,
} from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";

import * as AuthenticationStore from "../../../store/AuthenticationStore";
import * as ApplicationStore from "../../../store/index";
import * as UsersStore from "../../../store/UsersStore";
import { IUsers } from "../../../Dtos/IUsers";
import UserTable from "../../components/User/ViewUser/UserTable";
import { IItemValueFilter } from "../../../Dtos/IItemValueFilter";

import { isEmpty } from "../../../utils/isEmpty";
import TableTop from "../../components/Common/CustomTableTop";
import { IOnPageChangedData } from "../../components/Pagination/Pagination";

const ViewUser: FunctionComponent = () => {
  const componentRef = useRef<HTMLTableElement>(null);

  const [allowPaging, setAllowPaging] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [item, setItem] = useState("");
  const [value, setValue] = useState("");
  const [users, setUsers] = useState<IUsers[]>([]);
  const [currentUsers, setCurrentUsers] = useState<IUsers[]>([]);
  const [tableContent, setTableContent] = useState<IUsers[]>([]);
  const reactToPrint = useCallback(() => {
    return componentRef.current;
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const [userPrivilegeLoading, setUserPrivilegeLoading] = useState(false);

  useEffect(() => {
    dispatch(AuthenticationStore.actionCreators.getRolePrivilege("user"));
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
  }, [userPrivilegeLoading, unAuthorizedPage]);

  useEffect(() => {
    showMessage();
  }, [unAuthorizedPage, showMessage]);

  const ITEMS = ["Rolename", "Username"];

  const handlePrint = useReactToPrint({
    content: reactToPrint,
  });

  const globalUsers = useSelector((state: ApplicationStore.ApplicationState) => state.users?.users);

  const loading = useSelector((state: ApplicationStore.ApplicationState) => state.users?.loading);

  const isDownloading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.users?.isDownload
  );

  const response = useSelector((state: ApplicationStore.ApplicationState) => state.users?.response);

  const onExportClickHandler = () => {
    if (item === "" && value === "") {
      dispatch(UsersStore.actionCreators.export());
    } else {
      const userFilter: IItemValueFilter = {
        item,
        value,
      };
      dispatch(UsersStore.actionCreators.exportSearch(userFilter));
    }
  };

  const fetchHandler = useCallback(
    (item: string, value: string) => {
      if (item !== "" && value !== "") {
        const userFilter: IItemValueFilter = {
          item,
          value,
        };
        dispatch(UsersStore.actionCreators.searchUsers(userFilter));
      } else {
        dispatch(UsersStore.actionCreators.getUsers());
      }
    },
    [dispatch]
  );

  const handlePageChanged = ({ currentPage, pageLimit }: IOnPageChangedData) => {
    const offSet = (currentPage - 1) * pageLimit;
    let currentUsers = users?.slice(offSet, offSet + pageLimit);
    currentUsers = currentUsers ? currentUsers : [];
    setCurrentUsers(currentUsers);
  };

  useEffect(() => {
    fetchHandler(item, value);
  }, [value, fetchHandler]);

  useEffect(() => {
    if (allowPaging) setTableContent(currentUsers);
    else setTableContent(users);
  }, [allowPaging, setTableContent, users, currentUsers]);

  const handleCheckBoxChange = (event: ChangeEvent<HTMLInputElement>) => {
    globalUsers?.data.forEach((user) => {
      if (user.userName === event.target.name) {
        user.approved = !user.approved;
      }
    });
    onUsers();
  };

  const onApproveHandle = (userId: number) => {
    const user = tableContent.find((user) => user.userID === userId);
    if (user) dispatch(UsersStore.actionCreators.postApproved(user));
  };

  const onRefreshClickHandler = () => {
    setValue("");
    setItem("");
  };

  const onUsers = useCallback(() => {
    if (globalUsers) {
      setUsers(globalUsers.data);
    }
  }, [globalUsers, setUsers]);

  useEffect(() => {
    onUsers();
  }, [globalUsers, onUsers]);

  useEffect(() => {
    if (!loading && response) {
      if (response) {
        addToast("Privileges successfully added to role!", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Privileges successfully added to role!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      dispatch({ type: "CLEAR_RESPONSE" });
    }
  }, [loading, response, dispatch, addToast]);

  const [canEdit, setCanEdit] = useState(false);
  const user = useSelector((state: ApplicationStore.ApplicationState) => state.auth?.user);

  useEffect(() => {
    if (user?.role.toLowerCase() !== "system administrator" && rolePrivilege)
      setCanEdit(rolePrivilege?.edit);
  }, [user, rolePrivilege]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-account-network text-info mr-1" />
                  User Management
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-account-search text-info mr-1" />
                  View User
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="rounded-0">
            <Card.Header className="container-fluid bg-white">
              <Row className="justify-content-between">
                <Col sm={2}>
                  <div className="float-left">
                    <i className="mdi mdi-account-multiple-outline text-success icon-sm mr-2"></i>
                    <h5 className="d-inline">Users</h5>
                  </div>
                </Col>
                <Col sm="auto">
                  <span onClick={onExportClickHandler} role="button" className="mr-3">
                    <i className="mdi mdi-file-export icon-sm"></i>
                    Export
                    {isDownloading ? (
                      <Spinner className="ml-2" animation="border" size="sm" variant="success" />
                    ) : null}
                  </span>
                  <span onClick={handlePrint} role="button">
                    <i className="mdi mdi-printer text-success icon-sm" />
                    Print
                  </span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <TableTop
                handlePageChanged={handlePageChanged}
                items={ITEMS}
                onRefreshClickHandler={onRefreshClickHandler}
                item={item}
                setItem={setItem}
                setValue={setValue}
                value={value}
                allowPaging={allowPaging}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setAllowPaging={setAllowPaging}
                totalRecords={users?.length}
              />
              <Row>
                <Col md={3} className="align-self-center mt-3">
                  <h4>Total: {loading ? 0 : users?.length}</h4>
                </Col>
              </Row>
              {loading ? (
                <Row className="justify-content-md-center mt-5">
                  <Col sm="auto">
                    <Spinner animation="grow" variant="success" />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <UserTable
                    canEdit={canEdit}
                    ref={componentRef}
                    onApproveHandle={onApproveHandle}
                    onCheckBoxChange={handleCheckBoxChange}
                    usersData={tableContent}
                  />
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default ViewUser;

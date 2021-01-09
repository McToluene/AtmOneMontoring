import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import * as ApplicationStore from "../../../store/index";
import * as AuthenticationStore from "../../../store/AuthenticationStore";

const Navbar = () => {
  const state = useSelector((state: ApplicationStore.ApplicationState) => state.auth?.user);

  const toggleOffcanvas = () => {
    document.querySelector(".sidebar-offcanvas")?.classList.toggle("active");
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const onLogout = (event: any) => {
    event.preventDefault();
    dispatch(AuthenticationStore.actionCreators.logout());
    history.push("/auth/login");
  };

  return (
    <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          onClick={() => document.body.classList.toggle("sidebar-icon-only")}
        >
          <i className="mdi mdi-menu" />
        </button>
        <ul className="navbar-nav navbar-nav-right ml-lg-auto">
          <li className="nav-item nav-profile border-0 pl-4">
            <span className="nav-link bg-transparent">{state?.role}</span>
          </li>
          <li className="nav-item nav-profile border-0">
            <Dropdown alignRight>
              <Dropdown.Toggle
                id="profile-2"
                variant="outline-light"
                className="nav-link bg-transparent px-1 rounded-0"
              >
                <i className="mdi mdi-account-outline pr-1 align-center" />
                <span className="align-end">{state?.actort}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="preview-list navbar-dropdown">
                <div className="dropdown-divider"></div>
                <Dropdown.Item
                  className="dropdown-item preview-item d-flex align-items-center"
                  onClick={onLogout}
                >
                  <div className="preview-thumbnail align-middle">
                    <i className="mdi mdi-logout m-auto text-success align-middle" />
                  </div>
                  <div className="preview-item-content align-middle">
                    <h6 className="preview-subject font-weight-normal text-dark mt-1">Sign Out</h6>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleOffcanvas}
        >
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

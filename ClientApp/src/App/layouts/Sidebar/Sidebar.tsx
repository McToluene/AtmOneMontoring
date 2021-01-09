import React, { Component } from "react";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { Collapse } from "react-bootstrap";

type SidebarProps = RouteComponentProps<{}>;

class Sidebar extends Component<SidebarProps> {
  state = {} as any;

  toggleMenuState(menuState: any) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach((i) => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector("#sidebar")?.classList.remove("active");
    Object.keys(this.state).forEach((i) => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: "/dashboard", state: "dashboardMenuOpen" },
      { path: "/user", state: "userMenuOpen" },
      { path: "/role", state: "roleMenuOpen" },
      { path: "/terminal", state: "terminalMenuOpen" },
      { path: "/branch", state: "branchMenuOpen" },
      { path: "/configuration", state: "configurationMenuOpen" },
      { path: "/logs", state: "logsMenuOpen" },
    ];

    dropdownPaths.forEach((obj) => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true });
      }
    });
  }

  isPathActive(path: any) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector("body");
    document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
      if (body) {
        el.addEventListener("mouseover", function () {
          if (body.classList.contains("sidebar-icon-only")) {
            el.classList.add("hover-open");
          }
        });
        el.addEventListener("mouseout", function () {
          if (body.classList.contains("sidebar-icon-only")) {
            el.classList.remove("hover-open");
          }
        });
      }
    });
  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="text-center sidebar-brand-wrapper d-flex align-items-center">
          <a className="sidebar-brand brand-logo" href="index.html">
            <img
              src={require("../../../assets/images/atm-one.svg")}
              alt="logo"
            />
          </a>
          <a className="sidebar-brand brand-logo-mini pt-3" href="index.html">
            <img
              src={require("../../../assets/images/logo-mini.svg")}
              alt="logo"
            />
          </a>
        </div>
        <ul className="nav">
          <li
            className={
              this.isPathActive("/dashboard") ? "nav-item active" : "nav-item"
            }
          >
            <div
              className={
                this.state.dashboardMenuOpen
                  ? "nav-link menu-expanded"
                  : "nav-link"
              }
              onClick={() => this.toggleMenuState("dashboardMenuOpen")}
              aria-expanded={this.state.dashboardMenuOpen ? true : false}
              data-toggle="collapse"
            >
              <i className="mdi mdi-television text-success menu-icon"></i>
              <span className="menu-title">Dashboard</span>
              <i className="menu-arrow" />
            </div>
            <Collapse in={this.state.dashboardMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/dashboard/index")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/dashboard/index"
                  >
                    <i className="mdi mdi-television text-success mr-2"></i>
                    Index
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/dashboard/camera")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/dashboard/camera"
                  >
                    <i className="mdi mdi-webcam text-success mr-2" />
                    Camera
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/dashboard/electronicjournal")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/dashboard/electronicjournal"
                  >
                    <i className="mdi mdi-notebook-outline text-success mr-2"></i>
                    Electronic Journal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/dashboard/reports")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/dashboard/reports"
                  >
                    <i className="mdi mdi-format-align-center text-success mr-2" />
                    Details
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/user") ? "nav-item active" : "nav-item"
            }
          >
            <div
              className={
                this.state.userMenuOpen ? "nav-link menu-expanded" : "nav-link"
              }
              onClick={() => this.toggleMenuState("userMenuOpen")}
              data-toggle="collapse"
              aria-expanded={this.state.userMenuOpen ? true : false}
            >
              <i className="mdi mdi-account-network text-success menu-icon" />
              <span className="menu-title">User Management</span>
              <i className="menu-arrow" />
            </div>
            <Collapse in={this.state.userMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/user/createuser")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/user/createuser"
                  >
                    <i className="mdi mdi-account-plus text-success mr-2" />
                    Create User
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/user/viewuser")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/user/viewuser"
                  >
                    <i className="mdi mdi-account-search text-success mr-2 " />
                    View User
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/role") ? "nav-item active" : "nav-item"
            }
          >
            <div
              className={
                this.state.roleMenuOpen ? "nav-link menu-expanded" : "nav-link"
              }
              onClick={() => this.toggleMenuState("roleMenuOpen")}
              aria-expanded={this.state.roleMenuOpen ? true : false}
              data-toggle="collapse"
            >
              <i className="mdi mdi-account-key text-success menu-icon" />
              <span className="menu-title">Role Management</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.roleMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/role/roleprivilege")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/role/roleprivilege"
                  >
                    <i className="mdi mdi-account-plus text-success mr-2" />
                    Role Privilege
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/role/accessright")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/role/accessright"
                  >
                    <i className="mdi mdi-access-point text-success mr-2" />
                    Access Rights
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/terminal") ? "nav-item active" : "nav-item"
            }
          >
            <div
              className={
                this.state.terminalMenuOpen
                  ? "nav-link menu-expanded"
                  : "nav-link"
              }
              onClick={() => this.toggleMenuState("terminalMenuOpen")}
              data-toggle="collapse"
              aria-expanded={this.state.terminalMenuOpen ? true : false}
            >
              <i className="mdi mdi-console-network text-success menu-icon" />
              <span className="menu-title">Terminal</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.terminalMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/terminal/addterminal")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/terminal/addterminal"
                  >
                    <i className="mdi mdi-plus-network-outline text-success mr-2" />
                    Add Terminal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/terminal/viewterminal")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/terminal/viewterminal"
                  >
                    <i className="mdi mdi-console-network text-success mr-2" />
                    View Terminal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/terminal/connectedterminals")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/terminal/connectedterminals"
                  >
                    <i className="mdi mdi-lan-connect text-success mr-2" />
                    Connected Terminals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/terminal/licenseinfo")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/terminal/licenseinfo"
                  >
                    <i className="mdi mdi-information-outline text-success mr-2" />
                    License Info
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/branch") ? "nav-item active" : "nav-item"
            }
          >
            <div
              className={
                this.state.branchMenuOpen
                  ? "nav-link menu-expanded"
                  : "nav-link"
              }
              onClick={() => this.toggleMenuState("branchMenuOpen")}
              aria-expanded={this.state.branchMenuOpen ? true : false}
              data-toggle="collapse"
            >
              <i className="mdi mdi-source-branch text-success menu-icon"></i>
              <span className="menu-title">Branch</span>
              <i className="menu-arrow " />
            </div>
            <Collapse in={this.state.branchMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/branch/addbranch")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/branch/addbranch"
                  >
                    <i className="mdi mdi-source-branch-plus text-success mr-2" />
                    Add Branch
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/branch/viewbranch")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/branch/viewbranch"
                  >
                    <i className="mdi mdi-source-branch text-success mr-2" />
                    View Branch
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/configuration")
                ? "nav-item active"
                : "nav-item"
            }
          >
            <div
              className={
                this.state.configurationMenuOpen
                  ? "nav-link menu-expanded"
                  : "nav-link"
              }
              onClick={() => this.toggleMenuState("configurationMenuOpen")}
              aria-expanded={this.state.configurationMenuOpen ? true : false}
              data-toggle="collapse"
            >
              <i className="mdi mdi-cog-outline text-success menu-icon" />
              <span className="menu-title">Configuration</span>
              <i className="menu-arrow " />
            </div>
            <Collapse in={this.state.configurationMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/configuration/vendorconfiguration")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/configuration/vendorconfiguration"
                  >
                    <i className="mdi mdi-cogs text-success mr-1" />
                    Vendor Configuration
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive(
                        "/configuration/viewvendorconfiguration"
                      )
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/configuration/viewvendorconfiguration"
                  >
                    <i className="mdi mdi-file-cog-outline text-success mr-1" />
                    View Vendor Config
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/configuration/terminalconfiguration")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/configuration/terminalconfiguration"
                  >
                    <i className="mdi mdi-cog-sync-outline text-success mr-1" />
                    Terminal Configuration
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive(
                        "/configuration/viewterminalconfiguration"
                      )
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/configuration/viewterminalconfiguration"
                  >
                    <i className="mdi mdi-file-settings-outline text-success mr-1" />
                    View Terminal Config
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/configuration/configapproval")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/configuration/configapproval"
                  >
                    <i className="mdi mdi-cog-transfer-outline text-success mr-1" />
                    Config Approval
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/logs") ? "nav-item active" : "nav-item"
            }
          >
            <div
              className={
                this.state.logsMenuOpen ? "nav-link menu-expanded" : "nav-link"
              }
              onClick={() => this.toggleMenuState("logsMenuOpen")}
              aria-expanded={this.state.logsMenuOpen ? true : false}
              data-toggle="collapse"
            >
              <i className="mdi mdi-card-bulleted-outline text-success menu-icon" />
              <span className="menu-title">Logs</span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.logsMenuOpen}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/logs/blurredcameras")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/logs/blurredcameras"
                  >
                    <i className="mdi mdi-webcam text-success mr-2" />
                    Blurred Camera
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      this.isPathActive("/logs/accesslog")
                        ? "nav-link active"
                        : "nav-link"
                    }
                    to="/logs/accesslog"
                  >
                    <i className="mdi mdi-camera-rear text-success mr-2" />
                    Access Logs
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
          <li
            className={
              this.isPathActive("/audittrail") ? "nav-item active" : "nav-item"
            }
          >
            <Link className="nav-link" to="/audittrail">
              <i className="mdi mdi-account-search-outline text-success menu-icon"></i>
              <span className="menu-title">Audit Trail</span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default withRouter(Sidebar);

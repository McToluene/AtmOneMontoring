import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import IdleTimer from "react-idle-timer";

import * as Authentication from "../store/AuthenticationStore";
import * as ApplicationStore from "../store/index";
import DashRoutes from "./DashRoutes";
import Navbar from "./layouts/Navbar/Navbar";
import Sidebar from "./layouts/Sidebar/Sidebar";
import Footer from "./layouts/Footer/Footer";

import "./App.scss";
import { connect } from "react-redux";

type AppProps = ApplicationStore.ApplicationState &
  typeof Authentication.actionCreators &
  RouteComponentProps<{}>;

class App extends React.Component<AppProps> {
  state = {} as any;
  private refreshTokenTimeout: NodeJS.Timeout | undefined;
  idleTimer: IdleTimer | null;
  timeout: number;
  private activeTimeout: NodeJS.Timeout | undefined;

  constructor(props: any) {
    super(props);
    this.timeout = 300000;
    this.idleTimer = null;
    this.state = {
      remaining: this.timeout,
      isIdle: false,
      lastActive: new Date(),
      elapsed: 0,
    };
    // Bind event handlers and methods
    this.handleOnActive = this.handleOnActive.bind(this);
    this.handleOnIdle = this.handleOnIdle.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleResume = this.handleResume.bind(this);
  }

  componentDidMount() {
    this.onRouteChanged();

    if (this.props.auth?.isAuthenticated) {
      const expires = new Date(this.props.auth.user?.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000;
      this.refreshTokenTimeout = setTimeout(() => this.props?.refreshToken(), timeout);

      this.setState({
        remaining: this.idleTimer && this.idleTimer.getRemainingTime(),
        lastActive: this.idleTimer && this.idleTimer.getLastActiveTime(),
        elapsed: this.idleTimer && this.idleTimer.getElapsedTime(),
      });

      setInterval(() => {
        this.setState({
          remaining: this.idleTimer && this.idleTimer.getRemainingTime(),
          lastActive: this.idleTimer && this.idleTimer.getLastActiveTime(),
          elapsed: this.idleTimer && this.idleTimer.getElapsedTime(),
        });
      }, 1000);
    } else {
      if (this.activeTimeout) clearInterval(this.activeTimeout);
    }
  }

  render() {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : "";
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : "";
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : "";

    return (
      <React.Fragment>
        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          onActive={this.handleOnActive}
          onIdle={this.handleOnIdle}
          timeout={this.timeout}
        />
        <div className="container-scroller">
          {navbarComponent}
          <div className="container-fluid page-body-wrapper">
            {sidebarComponent}
            <div className="main-panel">
              <div className="content-wrapper">
                <DashRoutes />
              </div>
              {footerComponent}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }

    if (
      this.props.auth?.isAuthenticated === false &&
      prevProps.auth.isAuthenticated === true &&
      this.refreshTokenTimeout !== undefined
    ) {
      clearTimeout(this.refreshTokenTimeout);
      this.logoutUser();
    }

    if (this.props.auth?.isAuthenticated) {
      if (this.idleTimer?.getRemainingTime() === 0 && this.refreshTokenTimeout !== undefined) {
        const location = window.location.href;
        const canLogout = !location.includes("/dashboard/index")
          ? !location.includes("/dashboard/camera")
            ? !location.includes("/dashboard/electronicjournal")
              ? true
              : false
            : false
          : false;

        if (canLogout) {
          clearTimeout(this.refreshTokenTimeout);
          this.logoutUser();
        }
      }
      if (this.props?.auth?.user !== undefined && this.props.auth.user !== prevProps.auth.user) {
        const expires = new Date(this.props.auth.user?.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60 * 1000;
        this.refreshTokenTimeout = setTimeout(() => this.props?.refreshToken(), timeout);
      }
    }
  }

  onRouteChanged() {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = ["/auth/login"];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true,
        });
        document.querySelector(".page-body-wrapper")?.classList.add("full-page-wrapper");
        break;
      } else {
        this.checkAuth();
        this.setState({
          isFullPageLayout: false,
        });
        document.querySelector(".page-body-wrapper")?.classList.remove("full-page-wrapper");
      }
    }
  }

  // to logout user
  logoutUser() {
    this.props.logout();
    if (!window.location.href.includes("/auth/login")) {
      window.location.href = "/auth/login";
    }
  }

  checkAuth() {
    if (!localStorage.nekotTwj) {
      if (!window.location.href.includes("/auth/login")) {
        window.location.href = "/auth/login";
      }
    }
  }

  handleOnActive() {
    this.setState({ isIdle: false });
  }

  handleOnIdle() {
    this.setState({ isIdle: true });
  }

  handleReset() {
    if (this.idleTimer) this.idleTimer.reset();
  }

  handlePause() {
    if (this.idleTimer) this.idleTimer.pause();
  }

  handleResume() {
    if (this.idleTimer) this.idleTimer.resume();
  }
}

export default withRouter(
  connect(
    (state: Authentication.AuthenticationState) => ({ ...state }),
    Authentication.actionCreators
  )(App as any)
);

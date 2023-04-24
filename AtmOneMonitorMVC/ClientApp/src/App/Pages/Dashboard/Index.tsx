import React, { useCallback, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import * as ApplicationStore from "../../../store/index";
import * as DashboardStore from "../../../store/CameraStore";
import * as EjectStore from "../../../store/ElectronicJournalStore";
import * as AuthenticationStore from "../../../store/AuthenticationStore";
import SimpleLineChart from "../../components/Chart/SimpleLineChart/SimpleLineChart";
import { CameraLineChart } from "../../../Dtos/ICamera";
import { IElectronicJournalLineChart } from "../../../Dtos/IElectronicJournal";

import { ResponsiveContainer } from "recharts";
import { useHistory } from "react-router";

const removeAt = (value: string, postion: number): string => {
  const left = value.substring(0, postion);
  const right = value.substring(postion + 1, value.length);
  return left + right;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const camera = useSelector((state: ApplicationStore.ApplicationState) => state.camera?.camera);

  const electronicJournal = useSelector(
    (state: ApplicationStore.ApplicationState) => state.electronicJournal?.ej
  );

  const user = useSelector((state: ApplicationStore.ApplicationState) => state.auth?.user);

  useEffect(() => {
    if (user) {
      dispatch(AuthenticationStore.actionCreators.getRolePrivilegeRights(user.RoleId));
    }
  }, [user, dispatch]);

  const simpleCameraChartKeys = ["currently", "indeterminate", "stopped"];

  const cameraLineChartData: CameraLineChart[] = [] as CameraLineChart[];

  const buildCameraLineChart = useCallback(
    (data: string[]) => {
      data.forEach((value, index) => {
        const lastIndex = value.lastIndexOf(",");
        const preparedString = removeAt(value, lastIndex); // this was use to remove trailing , from each string.
        cameraLineChartData.push(JSON.parse(preparedString));
      });
      cameraLineChartData.reverse();
    },
    [cameraLineChartData]
  );

  const onCameraChartLoaded = useCallback(() => {
    const lineChart = camera?.lineChart;
    if (lineChart) {
      const data = lineChart?.split("'").join('"').trim().split("_");
      buildCameraLineChart(data);
    }
  }, [buildCameraLineChart, camera]);

  useEffect(() => {
    dispatch(DashboardStore.actionCreators.fetchCamera());
  }, [dispatch]);

  let cameraInterval: NodeJS.Timeout;

  useEffect(() => {
    cameraInterval = setInterval(() => {
      dispatch(DashboardStore.actionCreators.fetchCamera());
    }, 60000);
  }, [dispatch]);

  useEffect(() => {
    onCameraChartLoaded();
  }, [onCameraChartLoaded()]);

  const simpleChartKeys = ["empty", "blank", "skipping"];

  const lineChartData: IElectronicJournalLineChart[] = [] as IElectronicJournalLineChart[];

  const buildLineChart = useCallback(
    (data: string[]) => {
      data.forEach((value, index) => {
        const lastIndex = value.lastIndexOf(",");
        const preparedString = removeAt(value, lastIndex); // this was use to remove trailing , from each string.
        lineChartData.push(JSON.parse(preparedString));
      });
      lineChartData.reverse();
    },
    [lineChartData]
  );

  const onChartLoaded = useCallback(() => {
    const lineChart = electronicJournal?.lineChart;
    if (lineChart) {
      const data = lineChart?.split("'").join('"').trim().split("_");
      buildLineChart(data);
    }
  }, [buildLineChart, electronicJournal]);

  useEffect(() => {
    dispatch(EjectStore.actionCreators.fetchElectronicJournal());
  }, [dispatch]);

  let electronicJournalInterval: NodeJS.Timeout;

  useEffect(() => {
    electronicJournalInterval = setInterval(() => {
      dispatch(EjectStore.actionCreators.fetchElectronicJournal());
    }, 60200);
  }, [dispatch]);

  useEffect(() => {
    onChartLoaded();
  }, [onChartLoaded()]);

  // 1 for empty
  // 2 for blank
  // 3 for skipping
  // 4 total
  const onEjClick = (index: number) => {
    history.push("/dashboard/reports", {
      appId: "EJ",
      cat: `${index === 1 ? "empty" : index === 2 ? "blank" : index === 3 ? "skipping" : " "}`,
    });
  };

  // 1 for currently
  // 2 for stopped
  // 3 for indeterminate
  const onCameraClick = (index: number) => {
    history.push("/dashboard/reports", {
      appId: "IC",
      cat: `${
        index === 1 ? "currently" : index === 2 ? "stopped" : index === 3 ? "indeterminate" : " "
      }`,
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(cameraInterval);
      clearInterval(electronicJournalInterval);
    };
  }, []);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-television menu-icon text-info mr-2" />
                  Dashboard
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onCameraClick(1)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-camera text-warning icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {camera?.notCapturing}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-bookmark-outline mr-1" aria-hidden="true"></i>
                    Camera not capturing
                  </p>
                </div>
              </div>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onCameraClick(2)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-camera-off text-danger icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {camera?.stopped}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true"></i>
                    Camera stopped
                  </p>
                </div>
              </div>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onCameraClick(3)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-camera-burst text-info icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {camera?.indeterminate}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-reload mr-1" aria-hidden="true" />
                    Status intermediate
                  </p>
                </div>
              </div>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onCameraClick(4)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-plus-outline text-success icon-lg" />
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {camera
                            ? (camera.indeterminate === undefined ? 0 : camera.indeterminate) +
                              (camera.stopped === undefined ? 0 : camera.stopped) +
                              (camera.notCapturing === undefined ? 0 : camera.notCapturing)
                            : 0}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-information-variant mr-1" aria-hidden="true"></i>
                    Total Camera Issues
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onEjClick(1)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-delete-empty text-warning icon-lg" />
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {electronicJournal?.empty}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-bookmark-outline mr-1" aria-hidden="true"></i>
                    Empty EJ File
                  </p>
                </div>
              </div>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onEjClick(2)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-checkbox-blank-outline text-danger icon-lg" />
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {electronicJournal?.blank}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true"></i>
                    EJ Writting Blank
                  </p>
                </div>
              </div>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onEjClick(3)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-skip-next text-info icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {electronicJournal?.skipping}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-reload mr-1" aria-hidden="true"></i>
                    Suspected Skipping
                  </p>
                </div>
              </div>
            </Col>
            <Col xl={3} lg={3} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onEjClick(4)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-book-plus text-success icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">
                          {electronicJournal
                            ? (electronicJournal.empty === undefined
                                ? 0
                                : electronicJournal.empty) +
                              (electronicJournal.blank === undefined
                                ? 0
                                : electronicJournal.blank) +
                              (electronicJournal.skipping === undefined
                                ? 0
                                : electronicJournal.skipping)
                            : 0}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-bookmark-plus-outline mr-1" aria-hidden="true"></i>
                    Total EJ Issues
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={6} md={12} sm={12}>
          <Card className="card-statistics rounded-0 text-center">
            <Card.Header className="bg-white">
              <i className="mdi mdi-camera text-success mr-2"></i>
              Camera Status Line Chart
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer height="100%" width="100%">
                <SimpleLineChart data={cameraLineChartData} dataKey={simpleCameraChartKeys} />
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={12}>
          <Card className="card-statistics rounded-0 text-center">
            <Card.Header className="bg-white">
              <i className="mdi mdi-notebook-outline text-success mr-2"></i>
              Electronic Journal Status Line Chart
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer height="100%" width="100%">
                <SimpleLineChart data={lineChartData} dataKey={simpleChartKeys} />
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default Dashboard;

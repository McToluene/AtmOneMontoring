import React, { useEffect, useCallback } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { CameraLineChart } from "../../../Dtos/ICamera";
import Doughnut from "../../components/Chart/Doughnut/Doughnut";
import * as DashboardStore from "../../../store/CameraStore";
import * as ApplicationStore from "../../../store/index";
import * as OnlineTerminalStore from "../../../store/OnlineTerminalsStore";
import * as BlurredCameraStore from "../../../store/BlurredCameraStore";
import SimpleLineChart from "../../components/Chart/SimpleLineChart/SimpleLineChart";
import { ResponsiveContainer } from "recharts";
import { useHistory } from "react-router";

const removeAt = (value: string, postion: number): string => {
  const left = value.substring(0, postion);
  const right = value.substring(postion + 1, value.length);
  return left + right;
};

const CameraPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const camera = useSelector((state: ApplicationStore.ApplicationState) => state.camera?.camera);

  const data = [
    {
      name: "Not Capturing",
      value: camera?.notCapturing ? camera?.notCapturing : 0,
    },
    {
      name: "Indeterminate",
      value: camera?.indeterminate ? camera?.indeterminate : 0,
    },
    { name: "Stopped", value: camera?.stopped ? camera?.stopped : 0 },
  ];

  const simpleChartKeys = ["currently", "indeterminate", "stopped"];

  const lineChartData: CameraLineChart[] = [] as CameraLineChart[];

  const COLORS = ["#ffaf00", "#8862e0", "#FF0017"];

  const buildLineChart = useCallback(
    (data: string[]) => {
      data.forEach((value) => {
        const lastIndex = value.lastIndexOf(",");
        const preparedString = removeAt(value, lastIndex); // this was use to remove trailing , from each string.
        lineChartData.push(JSON.parse(preparedString));
      });
      lineChartData.reverse();
    },
    [lineChartData]
  );

  const onChartLoaded = useCallback(() => {
    const lineChart = camera?.lineChart;
    if (lineChart) {
      const data = lineChart?.split("'").join('"').trim().split("_");
      buildLineChart(data);
    }
  }, [buildLineChart, camera]);

  useEffect(() => {
    dispatch(DashboardStore.actionCreators.fetchCamera());
  }, [dispatch]);

  let cameraInterval: NodeJS.Timeout;
  useEffect(() => {
    cameraInterval = setInterval(() => {
      dispatch(DashboardStore.actionCreators.fetchCamera());
    }, 30000);
  }, [dispatch]);

  useEffect(() => {
    onChartLoaded();
  }, [onChartLoaded()]);

  const terminalsLoading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.loading
  );

  // 1 for currently
  // 2 for stopped
  // 3 for indeterminate
  // 4 for total
  const onFilterClick = (index: number) => {
    history.push("/dashboard/reports", {
      appId: "IC",
      cat: `${
        index === 1 ? "currently" : index === 2 ? "stopped" : index === 3 ? "indeterminate" : " "
      }`,
    });
  };

  const onValueSelected = (e: any) => {
    const name = e.name;
    if (name === "Not Capturing") onFilterClick(1);
    if (name === "Indeterminate") onFilterClick(3);
    if (name === "Stopped") onFilterClick(2);
  };

  let pieChartContent = (
    <Row className="justify-content-md-center mt-3">
      <Col sm="auto">
        <h4 className="m-5">Currently no data for today</h4>
      </Col>
    </Row>
  );
  if (
    !(camera?.indeterminate !== undefined && camera.indeterminate === 0) &&
    !(camera?.notCapturing !== undefined && camera?.notCapturing === 0) &&
    !(camera?.stopped !== undefined && camera?.stopped === 0)
  ) {
    pieChartContent = (
      <ResponsiveContainer height="99%" width="99%">
        <Doughnut data={data} colors={COLORS} cx="50%" cy="50%" onValueSelected={onValueSelected} />
      </ResponsiveContainer>
    );
  }

  const TERMINAL_COLORS = ["#2bb87e", "#FF0017"];

  const online = useSelector(
    (state: ApplicationStore.ApplicationState) => state.onlineTerminal?.online
  );

  const terminalData = [
    {
      name: "Online terminals",
      value: online?.data?.onlineTerminals ? online?.data?.onlineTerminals : 0,
    },
    {
      name: "Offline Terminals",
      value: online?.data?.totalTerminals
        ? online?.data?.totalTerminals - online?.data?.onlineTerminals
        : 0,
    },
  ];

  let terminalsStatsPie = (
    <Doughnut cx="50%" cy="50%" data={terminalData} colors={TERMINAL_COLORS} />
  );

  useEffect(() => {
    dispatch(OnlineTerminalStore.actionCreators.getOnlineTerminalsStats());
  }, [dispatch]);

  let onlineInterval: NodeJS.Timeout;
  useEffect(() => {
    onlineInterval = setInterval(() => {
      dispatch(OnlineTerminalStore.actionCreators.getOnlineTerminalsStats());
    }, 180000);
  }, [dispatch]);

  useEffect(() => {
    dispatch(BlurredCameraStore.actionCreators.getBlurredCamerasByMinute(10));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      clearInterval(cameraInterval);
      clearInterval(onlineInterval);
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch({ type: "CLEAR_BLURRED_TERMINALS", payload: [] });
    };
  }, []);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-home-outline text-info mr-2" />
                  Home
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-webcam text-info mr-2" />
                  Camera
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={4} md={12} sm={12}>
          <Row>
            <Col lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onFilterClick(1)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-camera text-warning icon-lg" />
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
                    <i className="mdi mdi-bookmark-outline mr-1" aria-hidden="true" />
                    Camera not capturing
                  </p>
                </div>
              </div>
            </Col>
            <Col lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onFilterClick(2)}>
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
            <Col lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onFilterClick(3)}>
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
            <Col lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onFilterClick(4)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-file-plus-outline text-success icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light mt-2 text-right text-dark">
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
                    <i className="mdi mdi-file-plus-outline mr-1" aria-hidden="true" />
                    Total Camera Issues
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={12} sm={12} className="grid-margin stretch-card">
          <Card className="card-statistics rounded-0">
            <Card.Header className="bg-white text-center">
              <i className="mdi mdi-console-network-outline text-success mr-2" />
              Terminal Status
            </Card.Header>
            <Card.Body className="p-0">
              {terminalsLoading ? (
                <Row className="justify-content-md-center mt-3">
                  <Col sm="auto">
                    <Spinner animation="grow" size="sm" variant="success" />
                  </Col>
                </Row>
              ) : (
                <ResponsiveContainer width="99%" height="99%">
                  {terminalsStatsPie}
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={8} md={12} sm={12} className="grid-margin stretch-card">
          <Card className="card-statistics rounded-0 text-center">
            <Card.Header className="bg-white">
              <i className="mdi mdi-camera text-success mr-2" />
              Camera Status Line Chart
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer height={450} width="100%">
                <SimpleLineChart data={lineChartData} dataKey={simpleChartKeys} />
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={12} sm={12} className="grid-margin stretch-card">
          <Card className="card-statistics rounded-0">
            <Card.Header className="bg-white text-center">
              <i className="mdi mdi-chart-arc text-success mr-2" />
              Pie Chart
            </Card.Header>
            <Card.Body>{pieChartContent}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default CameraPage;

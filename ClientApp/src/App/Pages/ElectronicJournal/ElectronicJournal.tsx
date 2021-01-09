import React, { useEffect, useCallback } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { ResponsiveContainer } from "recharts";

import { IElectronicJournalLineChart } from "../../../Dtos/IElectronicJournal";
import * as ElectronicJournalStore from "../../../store/ElectronicJournalStore";
import * as ApplicationStore from "../../../store/index";
import SimpleLineChart from "../../components/Chart/SimpleLineChart/SimpleLineChart";
import Doughnut from "../../components/Chart/Doughnut/Doughnut";
import { useHistory } from "react-router";

const removeAt = (value: string, postion: number): string => {
  const left = value.substring(0, postion);
  const right = value.substring(postion + 1, value.length);
  return left + right;
};

const ElectronicJournal = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.electronicJournal?.loading
  );

  const eject = useSelector(
    (state: ApplicationStore.ApplicationState) => state.electronicJournal?.ej
  );

  const lineChartData: IElectronicJournalLineChart[] = [] as IElectronicJournalLineChart[];

  const data = [
    { name: "Empty", value: eject?.empty ? eject?.empty : 0 },
    { name: "Blank", value: eject?.blank ? eject?.blank : 0 },
    { name: "Skipping", value: eject?.skipping ? eject?.skipping : 0 },
  ];

  const simpleChartKeys = ["empty", "blank", "skipping"];

  const COLORS = ["#ffaf00", "#8862e0", "#FF0017"];

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
    const lineChart = eject?.lineChart;
    if (lineChart) {
      const data = lineChart?.split("'").join('"').trim().split("_");
      buildLineChart(data);
    }
  }, [buildLineChart, eject]);

  useEffect(() => {
    dispatch(ElectronicJournalStore.actionCreators.fetchElectronicJournal());
  }, [dispatch]);

  let ejInterval: NodeJS.Timeout;
  useEffect(() => {
    ejInterval = setInterval(() => {
      dispatch(ElectronicJournalStore.actionCreators.fetchElectronicJournal());
    }, 90000);
  }, [dispatch]);

  useEffect(() => {
    onChartLoaded();
  }, [onChartLoaded()]);

  // 1 for empty
  // 2 for blank
  // 3 for skipping
  // 4 for total
  const onFilterClick = (index: number) => {
    history.push("/dashboard/reports", {
      appId: "EJ",
      cat: `${index === 1 ? "empty" : index === 2 ? "blank" : index === 3 ? "skipping" : " "}`,
    });
  };

  const onValueSelected = (e: any) => {
    const name = e.name;
    if (name === "Empty") onFilterClick(1);
    if (name === "Blank") onFilterClick(2);
    if (name === "Skipping") onFilterClick(3);
  };

  let pieChartContent;
  if (eject?.empty === 0 && eject?.blank === 0 && eject?.skipping === 0)
    pieChartContent = (
      <Row className="justify-content-md-center mt-3">
        <Col sm="auto">
          <h4 className="m-5">Currently no data for today</h4>
        </Col>
      </Row>
    );
  else
    pieChartContent = (
      <Doughnut data={data} colors={COLORS} cx="50%" cy="50%" onValueSelected={onValueSelected} />
    );

  useEffect(() => {
    return () => clearInterval(ejInterval);
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
                  <i className="mdi mdi-notebook-outline text-info mr-2" />
                  Electronic Journal
                </li>
              </ol>
            </nav>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={6} lg={6} md={6} sm={6}>
          <Row>
            <Col xl={6} lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onFilterClick(1)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-delete-empty text-warning icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light text-right text-dark">{eject?.empty}</h1>
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
            <Col xl={6} lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <div className="card card-statistics rounded-0" onClick={() => onFilterClick(2)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-checkbox-blank-outline text-danger icon-lg"></i>
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light mt-2 text-right text-dark">
                          {eject?.blank}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true" />
                    EJ Writting Blank
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xl={6} lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <Card className="card-statistics rounded-0" onClick={() => onFilterClick(3)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-skip-next text-info icon-lg" />
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-light mt-2 text-right text-dark">
                          {eject?.skipping}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-reload mr-1" aria-hidden="true" />
                    Suspected Skipping
                  </p>
                </div>
              </Card>
            </Col>
            <Col xl={6} lg={6} md={6} sm={6} className="grid-margin stretch-card">
              <Card className="card-statistics rounded-0" onClick={() => onFilterClick(4)}>
                <div className="card-body">
                  <div className="clearfix">
                    <div className="float-left">
                      <i className="mdi mdi-book-plus text-success icon-lg" />
                    </div>
                    <div className="float-right">
                      <div className="fluid-container">
                        <h1 className="font-weight-medium mt-2 text-right text-dark">
                          {eject
                            ? (eject.empty === undefined ? 0 : eject.empty) +
                              (eject.blank === undefined ? 0 : eject.blank) +
                              (eject.skipping === undefined ? 0 : eject.skipping)
                            : 0}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mt-3 mb-0">
                    <i className="mdi mdi-bookmark-plus-outline mr-1" aria-hidden="true" />
                    Total EJ Issues
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6} className="grid-margin stretch-card">
          <Card className="card-statistics rounded-0">
            <Card.Header className="bg-white text-center">
              <i className="mdi mdi-chart-arc text-success mr-2" />
              Pie Chart
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <Row className="justify-content-md-center mt-3">
                  <Col sm="auto">
                    <Spinner animation="grow" size="sm" variant="success" />
                  </Col>
                </Row>
              ) : (
                <ResponsiveContainer width="99%" height="99%">
                  {pieChartContent}
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col>
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

export default ElectronicJournal;

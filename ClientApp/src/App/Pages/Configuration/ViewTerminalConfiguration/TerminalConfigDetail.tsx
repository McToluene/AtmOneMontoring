import React, { useEffect, useCallback, useState } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import * as ApplicationStore from "../../../../store/index";
import * as TerminalConfigStore from "../../../../store/TerminalConfigStore";
import { IApproveTerminal } from "../../../../Dtos/ITerminal";
import TerminConfigDetailForm from "../../../components/Config/ViewTerminalConfig/TerminalConfigDetailForm";

const TerminalConfigDetail = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const configId = history.location.state;

  const globalConfig = useSelector(
    (state: ApplicationStore.ApplicationState) =>
      state.terminalConfig?.configApproval
  );

  const [terminalConfig, setTerminalConfig] = useState<IApproveTerminal>({
    ejPath: "",
    ejectMode: "",
    escalationDelayTimeInMin: 0,
    imageBrightness: 0,
    imagePath: "",
    intelliCamEnabled: false,
    ip: "",
    manageCapturing: false,
    nightSensitivity: 0,
    sendAlert: false,
    terminalId: "",
    updateDate: new Date(),
    updatedBy: "",
    validationMode: "",
    vendorConfigName: "",
    vendorName: "",
  });

  useEffect(() => {
    if (configId !== undefined)
      dispatch(
        TerminalConfigStore.actionCreators.getConfig(parseInt(String(configId)))
      );
    else history.push("/configuration/viewvendorconfiguration");
  }, [configId, dispatch]);

  const onFetch = useCallback(() => {
    if (globalConfig?.data) setTerminalConfig(globalConfig.data);
  }, [globalConfig, setTerminalConfig]);

  useEffect(() => {
    if (globalConfig) onFetch();
  }, [globalConfig, onFetch]);

  return (
    <Col>
      <Row>
        <Col>
          <div className="page-header rounded-0">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <i className="mdi mdi-cog-outline text-info mr-1" />
                  Configuration
                </li>
                <li className="breadcrumb-item">
                  <a
                    href="!#"
                    onClick={(event) => {
                      event.preventDefault();
                      history.push("/configuration/viewvendorconfiguration");
                    }}
                  >
                    <i className="mdi mdi-file-settings-outline text-info mr-1" />
                    View Terminal Configuration
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <i className="mdi mdi-details text-info mr-1" />
                  Terminal Configuration Detail
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
              <Row>
                <Col md={10}>
                  <div className="float-left">
                    <i className="mdi mdi-details text-success icon-sm mr-2" />
                    <h5 className="d-inline">Terminal Configuration Detail</h5>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <TerminConfigDetailForm
                terminalConfig={terminalConfig}
                configId={parseInt(String(configId))}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default TerminalConfigDetail;

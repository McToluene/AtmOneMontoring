import React, { useEffect, useCallback, useState } from "react";
import { Row, Col, Form, Button, FormControl, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";

import * as ApplicationStore from "../../../../store/index";
import * as BranchStore from "../../../../store/BranchStore";
import * as VendorStore from "../../../../store/VendorStore";
import * as TerminalStore from "../../../../store/TerminalStore";
import { ITerminalCreate } from "../../../../Dtos/ITerminal";

type Error = {
  ip: string;
  title: string;
  terminal: string;
};

export default function AddAtm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const vendors = useSelector((state: ApplicationStore.ApplicationState) => state.vendor?.vendors);

  const branches = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.branches
  );

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.loading
  );

  const [isCreateClick, setIsCreateClick] = useState(false);

  const isCreated = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.isCreated.data
  );

  const detail = useSelector(
    (state: ApplicationStore.ApplicationState) => state.terminal?.terminal
  );

  const [terminal, setTerminal] = useState({
    id: 0,
    vendor: 1,
    ip: "",
    title: "",
    terminal: "",
    branch: 1,
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: terminal,

    validate: (values) => {
      const errors = {} as Error;

      if (!validateIp(values.ip)) {
        errors.ip = "That's not a valid IP address!";
      }

      if (!values.ip) {
        errors.ip = "Please IP field is required!";
      }

      if (!values.title) {
        errors.title = "Please title field is required!";
      }

      if (!values.terminal) {
        errors.terminal = "Please terminal field is required!";
      }

      return errors;
    },

    onSubmit: (values) => {
      const terminal: ITerminalCreate = {
        id: values.id,
        branchId: values.branch,
        ip: values.ip,
        terminalId: values.terminal,
        title: values.title,
        vendorId: values.vendor,
      };
      if (terminalId) dispatch(TerminalStore.actionCreators.updateTerminal(terminal));
      else dispatch(TerminalStore.actionCreators.addTerminal(terminal));
      setIsCreateClick(true);
    },
  });

  useEffect(() => {
    dispatch(BranchStore.actionCreators.getBranches());
  }, [dispatch]);

  useEffect(() => {
    dispatch(VendorStore.actionCreators.getVendors());
  }, [dispatch]);

  const validateIp = (ip: string): boolean => new RegExp("d{1,3}.d{1,3}.d{1,3}.d{1,3}").test(ip);

  const terminalId = history.location.state;

  useEffect(() => {
    if (terminalId) {
      dispatch(TerminalStore.actionCreators.getTerminalDetail(String(terminalId).toString()));
    }
  }, [dispatch, terminalId]);

  const onDetail = useCallback(() => {
    if (detail?.data) {
      const terminalDetail = {
        id: detail.data.id,
        vendor: detail?.data.vendorId,
        ip: detail?.data.ip,
        title: detail?.data.title,
        terminal: detail?.data.terminalId,
        branch: detail?.data.branchId,
      };
      setTerminal(terminalDetail);
    }
  }, [detail, setTerminal]);

  useEffect(() => {
    if (detail) onDetail();
  }, [detail, onDetail]);

  const onCreateMessage = useCallback(() => {
    if (isCreated) {
      addToast(`Terminal successfully ${terminalId !== undefined ? "updated" : "created"}!`, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast(`Failed to ${terminalId !== undefined ? "update" : "create"} terminal!`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_CREATED", payload: false });
  }, [isCreated, dispatch, addToast, terminalId]);

  useEffect(() => {
    if (!loading && isCreateClick) {
      onCreateMessage();
      setIsCreateClick(false);
    }
  }, [loading, isCreateClick, onCreateMessage, setIsCreateClick]);

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const user = useSelector((state: ApplicationStore.ApplicationState) => state.auth?.user);

  const [canAddEdit, setCanAddEdit] = useState(false);

  useEffect(() => {
    return () => {
      history.location.state = undefined;
      setTerminal({
        id: 0,
        vendor: 1,
        ip: "",
        title: "",
        terminal: "",
        branch: 1,
      });
    };
  }, [history, setTerminal]);

  useEffect(() => {
    if (user && rolePrivilege) {
      if (terminalId === undefined) {
        setCanAddEdit(!rolePrivilege.add);
      } else {
        setCanAddEdit(!rolePrivilege.edit);
      }
    }
  }, [user, rolePrivilege, terminalId]);

  return (
    <Row>
      <Col sm={9}>
        <form onSubmit={formik.handleSubmit} className="form form-row">
          <Form.Group as={Col} sm={6} controlId="vendor">
            <Form.Label>Vendor</Form.Label>
            <Form.Control
              name="vendor"
              onChange={formik.handleChange}
              value={formik.values.vendor || 0}
              as="select"
              size="lg"
              className="rounded-0"
              custom
            >
              {vendors?.map((vendor) => (
                <option key={vendor.vendorId} value={vendor.vendorId}>
                  {vendor.vendor}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} sm={6} controlId="ip">
            <Form.Label>IP</Form.Label>
            <Form.Control
              name="ip"
              className="rounded-0"
              onChange={formik.handleChange}
              value={formik.values.ip}
              isInvalid={formik.errors.ip && formik.touched.ip ? true : false}
              placeholder="Enter Terminal IP"
              size="lg"
              type="text"
            />
            {formik.errors.ip ? (
              <FormControl.Feedback type="invalid">{formik.errors.ip}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={6} controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              type="text"
              placeholder="Enter Terminal Title"
              size="lg"
              className="rounded-0"
              isInvalid={formik.errors.title && formik.touched.title ? true : false}
            />
            {formik.errors.title ? (
              <FormControl.Feedback type="invalid">{formik.errors.title}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={6} controlId="terminal">
            <Form.Label>Terminal</Form.Label>
            <Form.Control
              name="terminal"
              className="rounded-0"
              placeholder="Enter Terminal ID"
              onChange={formik.handleChange}
              value={formik.values.terminal}
              size="lg"
              type="number"
              isInvalid={formik.errors.terminal && formik.touched.terminal ? true : false}
            />
            {formik.errors.terminal ? (
              <FormControl.Feedback type="invalid">{formik.errors.terminal}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={6} controlId="branch">
            <Form.Label>Branch</Form.Label>
            <Form.Control
              name="branch"
              onChange={formik.handleChange}
              value={formik.values.branch}
              className="rounded-0"
              as="select"
              size="lg"
              custom
            >
              {branches?.data?.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Col className="align-self-center">
            <Button
              className="rounded-0"
              type="submit"
              disabled={canAddEdit}
              size="sm"
              variant="outline-success"
            >
              {terminalId ? <span> Update </span> : <span>Create</span>}

              {loading ? (
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
              ) : null}
            </Button>
          </Col>
        </form>
      </Col>
    </Row>
  );
}

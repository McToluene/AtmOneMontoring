import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, FormControl, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import * as ApplicationStore from "../../../../store/index";
import * as BranchStore from "../../../../store/BranchStore";
import { useHistory } from "react-router";
import { IBranch } from "../../../../Dtos/IBranch";
import { useToasts } from "react-toast-notifications";

type Error = {
  branchCode: string;
  branchName: string;
  emails: string;
};

const AddOrEditBranch = () => {
  const [isCreateClick, setIsCreateClick] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();

  const [branch, setBranch] = useState<IBranch>({
    branchId: 0,
    branchCode: "",
    branchName: "",
    emails: "",
  });

  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isBranchLoading
  );

  const isCreated = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isCreated.data
  );

  const detail = useSelector((state: ApplicationStore.ApplicationState) => state.branch?.branch);

  const rolePrivilege = useSelector(
    (state: ApplicationStore.ApplicationState) => state.auth?.rolePrivilege
  );

  const branchId = history.location.state;

  const [canAddEdit, setCanAddEdit] = useState(false);

  useEffect(() => {
    if (rolePrivilege) {
      if (branchId !== undefined) {
        setCanAddEdit(!rolePrivilege.edit);
      } else {
        setCanAddEdit(!rolePrivilege.add);
      }
    }
  }, [rolePrivilege, branchId]);

  useEffect(() => {
    if (branchId !== undefined)
      dispatch(BranchStore.actionCreators.getBranch(parseInt(String(branchId).toString())));
  }, [branchId, dispatch]);

  const onBranchFetch = useCallback(() => {
    if (detail?.data) {
      const branchDetails: IBranch = {
        branchId: detail.data.branchId,
        branchCode: detail.data.branchCode,
        branchName: detail.data.branchName,
        emails: detail.data.emails,
      };
      setBranch(branchDetails);
    }
  }, [detail, setBranch]);

  useEffect(() => {
    if (detail) onBranchFetch();
  }, [detail, onBranchFetch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: branch,

    validate: (values) => {
      const errors = {} as Error;
      if (!values.branchCode) errors.branchCode = "Please branch code is required!";
      if (!values.branchName) errors.branchName = "Please branch title is required!";
      if (!values.emails) errors.emails = "Please branch email(s) is required!";
      return errors;
    },

    onSubmit: (values) => {
      if (branchId !== undefined) dispatch(BranchStore.actionCreators.updateBranch(values));
      else dispatch(BranchStore.actionCreators.addBranch(values));

      setIsCreateClick(true);
    },
  });

  const onCreateMessage = useCallback(() => {
    if (isCreated) {
      addToast(`Branch successfully ${branchId !== undefined ? "updated" : "created"}!`, {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast(`Failed to ${branchId !== undefined ? "update" : "create"} branch!`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_CREATED", payload: false });
  }, [isCreated, dispatch, addToast, branchId]);

  useEffect(() => {
    if (!loading && isCreateClick) {
      onCreateMessage();
      setIsCreateClick(false);
    }
  }, [loading, isCreateClick, onCreateMessage, setIsCreateClick]);

  return (
    <Row>
      <Col sm={8}>
        <form className="form form-row" onSubmit={formik.handleSubmit}>
          <Form.Group as={Col} sm={12} controlId="branchCode">
            <Form.Label>Branch Code</Form.Label>
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.branchCode}
              size="sm"
              className="rounded-0"
              placeholder="Enter Bank Branch Code"
              isInvalid={formik.errors.branchCode && formik.touched.branchCode ? true : false}
            />
            {formik.errors.branchCode ? (
              <FormControl.Feedback type="invalid">{formik.errors.branchCode}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={12} controlId="branchName">
            <Form.Label>Branch Title</Form.Label>
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.branchName}
              size="sm"
              className="rounded-0"
              placeholder="Enter Bank Branch Title"
              isInvalid={formik.errors.branchName && formik.touched.branchName ? true : false}
            />
            {formik.errors.branchName ? (
              <FormControl.Feedback type="invalid">{formik.errors.branchName}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} sm={12} controlId="emails">
            <Form.Label>Email(s)</Form.Label>
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.emails}
              size="sm"
              as="textarea"
              rows={5}
              className="rounded-0"
              placeholder="Enter Bank Branch Emails"
              isInvalid={formik.errors.emails && formik.touched.emails ? true : false}
            />
            {formik.errors.emails ? (
              <FormControl.Feedback type="invalid">{formik.errors.emails}</FormControl.Feedback>
            ) : null}
          </Form.Group>
          <Col>
            <Button
              type="submit"
              className="rounded-0"
              disabled={canAddEdit}
              size="sm"
              variant="outline-success"
            >
              {branchId ? <span> Update </span> : <span>Create</span>}

              {loading ? (
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
              ) : null}
            </Button>
          </Col>
        </form>
      </Col>
    </Row>
  );
};

export default AddOrEditBranch;

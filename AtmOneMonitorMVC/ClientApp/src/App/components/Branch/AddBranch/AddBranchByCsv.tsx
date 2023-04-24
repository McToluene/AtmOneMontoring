import React, { useState, useCallback, useEffect, Fragment } from "react";
import { Row, Col, Form, Button, Spinner, Table } from "react-bootstrap";
import { CSVReader } from "react-papaparse";
import ContentEditable from "react-contenteditable";
import { useToasts } from "react-toast-notifications";

import * as ApplicationStore from "../../../../store/index";
import * as BranchStore from "../../../../store/BranchStore";
import { useSelector, useDispatch } from "react-redux";

const AddBranchByCsv = () => {
  const { addToast } = useToasts();
  const loading = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isBranchLoading
  );

  const isCreated = useSelector(
    (state: ApplicationStore.ApplicationState) => state.branch?.isCreated.data
  );

  const dispatch = useDispatch();
  const [branches, setBranches] = useState<any[]>([]);

  const [isCreateClick, setIsCreateClick] = useState(false);

  const handleOnDrop = (data: any) => {
    setBranches(data);
  };

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err);
  };

  const handleOnRemoveFile = (data: any) => {
    // console.log(data);
  };

  const onSubmit = () => {
    if (branches.length > 0) {
      const preparedBranches: {
        branchCode: string;
        branchName: string;
        emails: string;
      }[] = [];

      branches?.forEach((branch, index) => {
        if (index > 0) {
          if (branch) {
            const b: { branchCode: string; branchName: string; emails: string } = {
              branchCode: "",
              branchName: "",
              emails: "",
            };
            branch?.data.forEach((value: any, index: number) => {
              if (index === 1) b.branchCode = value;
              if (index === 2) b.branchName = value;
              if (index === 3) b.emails = value;
            });
            preparedBranches.push(b);
          }
        }
      });
      dispatch(BranchStore.actionCreators.addBranches(preparedBranches));
      setIsCreateClick(true);
    }
  };

  const onCreateMessage = useCallback(() => {
    if (isCreated) {
      addToast("Branches successfully added!", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed to create some/all branches!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    dispatch({ type: "SET_IS_CREATED", payload: false });
  }, [isCreated, dispatch, addToast]);

  useEffect(() => {
    if (!loading && isCreateClick) {
      onCreateMessage();
      setIsCreateClick(false);
    }
  }, [loading, isCreateClick, onCreateMessage, setIsCreateClick]);

  const handleChange = (event: any, editIndex: number, editValueIndex: number) => {
    branches?.forEach((branch, index) =>
      index === editIndex ? (branch.data[editValueIndex] = event.target.value) : branch
    );
    setBranches(branches);
  };

  const onDeleteHandle = (inx: number) => {
    setBranches((branches) => branches.filter((branch, index) => index !== inx));
  };

  return (
    <Fragment>
      <Row className="justify-content-sm-center mt-3">
        <Col sm={12}>
          <Form as={Row} inline>
            <Col sm={8}>
              <CSVReader
                onDrop={handleOnDrop}
                onError={handleOnError}
                style={{ padding: "0px" }}
                config={{}}
                addRemoveButton
                onRemoveFile={handleOnRemoveFile}
              >
                <span>Drop CSV file here or click to upload.</span>
              </CSVReader>
            </Col>
            <Button
              onClick={onSubmit}
              className="rounded-0"
              disabled={branches.length <= 0 || isCreateClick}
              size="sm"
              variant="outline-success"
            >
              Create
              {loading ? (
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
              ) : null}
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {branches.length > 0 ? (
            <Table responsive hover bordered className="mt-4 rounded-0" size="sm">
              <thead>
                {branches?.map((branch, index) =>
                  index == 0 ? (
                    <tr key={index} className="table-secondary">
                      {branch?.data?.map((title: any, titleIndex: number) => (
                        <th key={titleIndex}>{title}</th>
                      ))}
                      <th></th>
                    </tr>
                  ) : null
                )}
              </thead>
              <tbody>
                {branches?.map((branch, index) =>
                  index > 0 ? (
                    <tr key={index}>
                      {branch?.data?.map((value: any, valueIndex: number) => (
                        <td key={valueIndex}>
                          <ContentEditable
                            key={valueIndex}
                            html={`${value}`}
                            disabled={false}
                            onChange={(event) => handleChange(event, index, valueIndex)}
                          />
                        </td>
                      ))}
                      <td>
                        <Button
                          onClick={() => onDeleteHandle(index)}
                          className="rounded-0"
                          size="sm"
                          variant="outline-danger"
                        >
                          <i className="mdi mdi-delete align-middle" />
                          <span className="align-middle"> Delete </span>
                        </Button>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </Table>
          ) : null}
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddBranchByCsv;

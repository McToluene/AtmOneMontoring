import React, { MouseEvent, FunctionComponent, useEffect, useState, useCallback } from "react";
import { Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import * as ApplicationStore from "../../../../store/index";
import TestLdapForm from "./TestLdapForm";

interface ITestLdapState {
  ldapString: string;
  domain: string;
  filter: string;
  username: string;
  password: string;
}

interface ITestLdapProps {
  onTestClick: (event: MouseEvent<HTMLElement>, testDteails: any) => void;
  testLoading: boolean;
  state: ITestLdapState;
  setState: (state: ITestLdapState) => void;
}

const TestLdap: FunctionComponent<ITestLdapProps> = (props) => {
  const { state, setState } = props;
  const ldap = useSelector((state: ApplicationStore.ApplicationState) => state.users?.ldap);

  const setLdap = useCallback(() => {
    if (ldap) {
      setState({ ...state, domain: ldap.domain, ldapString: ldap.ldapstring, filter: ldap.filter });
    }
  }, [ldap, setState]);

  const [errors, setErrors] = useState({
    domain: "",
    ldapString: "",
  });

  useEffect(() => {
    setLdap();
  }, [ldap, setLdap]);

  const onTestClickHandle = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (validateForm(errors)) {
      const testDetails = {
        domain: state.domain,
        ldapString: state.ldapString,
        username: state.username,
        password: state.password,
      };
      props.onTestClick(event, testDetails);
    }
  };

  const validateForm = (errors: { domain: string; ldapString: string }): boolean => {
    let isValid: boolean = true;
    Object.values(errors).forEach((val) => val.length > 0 && (isValid = false));
    return isValid;
  };

  return (
    <Col md={9}>
      <TestLdapForm
        testLoading={props.testLoading}
        errors={errors}
        setErrors={setErrors}
        formState={state}
        setFormState={setState}
        onTestClickHandler={onTestClickHandle}
      />
    </Col>
  );
};

export default TestLdap;

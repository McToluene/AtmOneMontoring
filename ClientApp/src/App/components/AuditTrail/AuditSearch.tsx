import React, { FunctionComponent, useEffect, useState } from "react";
import { Form, Col } from "react-bootstrap";

import UserSelect from "./UserSelect";
import PrivilegeSelect from "./PrivliegeSelect";

interface IAuditSearchProps {
  user: number;
  privilege: number;
  setUser: (value: number) => void;
  setPrivilege: (value: number) => void;
  setDisableDateFilter: (disableDateFilter: boolean) => void;
}

const AuditSearch: FunctionComponent<IAuditSearchProps> = (props) => {
  const { user, privilege, setUser, setPrivilege, setDisableDateFilter } = props;
  const [disablePrivilege, setDisablePrivilege] = useState(false);
  useEffect(() => {
    if (user <= 0) {
      setDisablePrivilege(true);
      setDisableDateFilter(true);
    } else {
      setDisablePrivilege(false);
      setDisableDateFilter(false);
    }
  }, [user, setDisablePrivilege]);

  return (
    <Form as={Col} sm={5} inline>
      <UserSelect user={user} setUser={setUser} />
      <PrivilegeSelect
        privilege={privilege}
        setPrivilege={setPrivilege}
        disable={disablePrivilege}
      />
    </Form>
  );
};

export default AuditSearch;

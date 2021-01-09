import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useHistory } from "react-router";

const Error401 = () => {
  const location = useLocation();
  const history = useHistory();
  const [errorPage, setErrorPage] = useState("");

  useEffect(() => {
    const page = location?.state;
    if (page === undefined) {
      // history.push("/dashboard/index");
    } else {
      setErrorPage(String(page));
    }
  }, [setErrorPage, history]);

  useEffect(() => {
    return () => (location.state = undefined);
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center text-center error-page pt-5 pb-4 h-100">
        <div className="row flex-grow">
          <div className="col-lg-8 mx-auto text-danger">
            <div className="row align-items-center d-flex flex-row">
              <div className="col-lg-6 text-lg-right pr-lg-4">
                <h1 className="display-1 mb-0">401</h1>
              </div>
              <div className="col-lg-6 error-page-divider text-lg-left pl-lg-4">
                <h2>OOPS!</h2>
                <h3 className="font-weight-light">You're not authorized to view page</h3>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-12 text-center mt-xl-2">
                <Link className="text-success font-weight-medium" to="/dashboard/index">
                  Go To Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error401;

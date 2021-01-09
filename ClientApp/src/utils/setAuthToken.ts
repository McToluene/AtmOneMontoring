import axios from "axios";
import { isEmpty } from "./isEmpty";

const setAuthToken = (token: string) => {
  if (!isEmpty(token)) {
    axios.defaults.headers.common.Authorization = "Bearer " + token;
  } else {
    delete axios.defaults.headers.Authorization;
  }
};

export default setAuthToken;

import { useState } from "react";
import axios from "axios";
import ErrorWrapper from "../../components/ErrorWrapper";

const useRequest = ({ url, method = "get", body = {}, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      const res = await axios[method](url, { ...body, ...props });
      setErrors(null);
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      setErrors(<ErrorWrapper errors={err.response.data.errors} />);
    }
  };

  return { doRequest, errors };
};

export default useRequest;

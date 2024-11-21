import { useState } from "react";
import axios from "axios";

const useRequest = ({ url, method = "get", body = {}, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const res = await axios[method](url, body);
      setErrors(null);
      if (onSuccess) onSuccess(res.data);
      return res.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {err.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;

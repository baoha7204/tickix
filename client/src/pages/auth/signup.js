import { useState } from "react";
import { useRouter } from "next/router";

import useRequest from "../_hooks/use-request";

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/sign-up",
    method: "post",
    body: { email, password },
    onSuccess: () => router.push("/auth/signin"),
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};

export default SignupPage;

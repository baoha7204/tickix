import { useEffect } from "react";
import { useRouter } from "next/router";

import useRequest from "../_hooks/use-request";

const SignoutPage = () => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/sign-out",
    method: "post",
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Sign out...</div>;
};

export default SignoutPage;

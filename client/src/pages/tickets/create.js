import { useRouter } from "next/router";
import { useState } from "react";
import useRequest from "../_hooks/use-request";

const CreateTicketPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: { title, price: Number(price) },
    onSuccess: () => router.push("/"),
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const handlePriceBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <form className="d-flex flex-column gap-4" onSubmit={handleSubmit}>
      <h1>New ticket</h1>
      <div className="form-group">
        <label>Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          value={price}
          onBlur={handlePriceBlur}
          onChange={(event) => setPrice(event.target.value)}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default CreateTicketPage;

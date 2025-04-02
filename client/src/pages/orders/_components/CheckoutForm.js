import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import ErrorWrapper from "../../../components/ErrorWrapper";
import useRequest from "../../_hooks/use-request";

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errors, setErrors] = useState([]);
  const { doRequest, errors: createIntentErrors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) return;

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrors((prev) => [...prev, submitError]);
      return;
    }

    // Create the PaymentIntent and obtain clientSecret from your server endpoint
    const res = await doRequest();

    if (createIntentErrors) {
      setErrors((prev) => [...prev, createIntentErrors]);
      return;
    }

    const { client_secret: clientSecret } = res;

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `https://tickix.dev/orders/${order.id}/success`,
      },
    });

    if (error) setErrors((prev) => [...prev, error]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!stripe || !elements}
      >
        Pay
      </button>
      {errors.length > 0 && <ErrorWrapper errors={errors} />}
    </form>
  );
};

export default CheckoutForm;

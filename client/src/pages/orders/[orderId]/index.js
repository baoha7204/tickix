import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../_components/CheckoutForm";

const OrderDetailPage = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const optionsOrder = useMemo(
    () => ({
      mode: "payment",
      currency: "usd",
      amount: order.ticket.price * 100,
    }),
    [order.id, order.ticket.price]
  );

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order.id]);

  if (timeLeft < 0) return <div>Order expired</div>;
  return (
    <div>
      {timeLeft} seconds until order expires
      <Elements
        stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}
        options={optionsOrder}
      >
        <CheckoutForm order={order} />
      </Elements>
    </div>
  );
};

OrderDetailPage.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderDetailPage;

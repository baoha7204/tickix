import { useMemo } from "react";

const OrderSuccess = ({ order }) => {
  const isValid = useMemo(() => order && order.status === "complete", [order]);

  if (!order) return <div>There is not any order here...</div>;

  if (!isValid) {
    return (
      <div>
        <h1>Order Failed</h1>
      </div>
    );
  }
  return (
    <div>
      <h1>
        Order Success <span className="glyphicon glyphicon-ok"></span>
      </h1>
    </div>
  );
};

OrderSuccess.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderSuccess;

import Order from "../../components/Order";

const OrderListPage = ({ orders }) => {
  // Group orders by status
  const completedOrders = orders.filter((order) => order.status === "complete");
  const pendingOrders = orders.filter(
    (order) => order.status === "awaiting:payment"
  );
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          You haven't placed any orders yet.
        </div>
      ) : (
        <>
          {pendingOrders.length > 0 && (
            <div className="mb-4">
              <h3>Pending Orders</h3>
              {pendingOrders.map((order) => (
                <Order key={order.id} order={order} />
              ))}
            </div>
          )}

          {completedOrders.length > 0 && (
            <div className="mb-4">
              <h3>Completed Orders</h3>
              {completedOrders.map((order) => (
                <Order key={order.id} order={order} />
              ))}
            </div>
          )}

          {cancelledOrders.length > 0 && (
            <div className="mb-4">
              <h3>Cancelled Orders</h3>
              {cancelledOrders.map((order) => (
                <Order key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

OrderListPage.getInitialProps = async (_, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderListPage;

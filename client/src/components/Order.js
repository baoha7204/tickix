import { useRouter } from "next/router";

const Order = ({ order }) => {
  const router = useRouter();

  // Function to format the expiration date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Function to get appropriate badge color based on order status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "complete":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      case "awaiting:payment":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{order.ticket.title}</h5>
          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <p className="card-text">Price: ${order.ticket.price}</p>
        <p className="card-text text-muted">
          {order.status === "awaiting:payment"
            ? `Expires: ${formatDate(order.expiresAt)}`
            : `Created: ${formatDate(order.expiresAt)}`}
        </p>

        {order.status === "awaiting:payment" && (
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default Order;

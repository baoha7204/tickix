import { useRouter } from "next/router";
import useRequest from "../_hooks/use-request";

const TicketDetailPage = ({ ticket }) => {
  const router = useRouter();
  const { title, price } = ticket;
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  const handlePurcharse = () => {
    doRequest();
  };

  return (
    <div>
      <h1>{title}</h1>
      <h4>Price: ${price}</h4>
      <button className="btn btn-primary" onClick={handlePurcharse}>
        Purchase
      </button>
      {errors}
    </div>
  );
};

TicketDetailPage.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketDetailPage;

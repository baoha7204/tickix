import Link from "next/link";

const Ticket = ({ price, title, id }) => {
  return (
    <Link
      href="/tickets/[ticketId]"
      as={`/tickets/${id}`}
      className="text-decoration-none"
    >
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Price: {price}</h6>
        </div>
      </div>
    </Link>
  );
};
 
export default Ticket;

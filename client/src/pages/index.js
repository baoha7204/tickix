import { useRouter } from "next/router";
import { useState } from "react";
import Ticket from "../components/Ticket";

const MyTicketsPage = ({ availableTickets, myTickets, currentUser }) => {
  const router = useRouter();
  const [showPurchased, setShowPurchased] = useState(false);

  const displayTickets = currentUser
    ? showPurchased
      ? myTickets.filter((ticket) => ticket.orderId)
      : myTickets.filter((ticket) => !ticket.orderId)
    : availableTickets;

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center mt-2">
        <h1 className="mb-0">Tickets</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/tickets/create")}
        >
          Create new one
        </button>
      </div>

      {currentUser && (
        <div className="btn-group mb-3" role="group">
          <button
            type="button"
            className={`btn ${
              !showPurchased ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setShowPurchased(false)}
          >
            Available Tickets
          </button>
          <button
            type="button"
            className={`btn ${
              showPurchased ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setShowPurchased(true)}
          >
            My Purchases
          </button>
        </div>
      )}

      {displayTickets.length === 0 ? (
        <div className="alert alert-info">
          {showPurchased
            ? "You haven't purchased any tickets yet."
            : "No tickets available."}
        </div>
      ) : (
        displayTickets.map((ticket) => <Ticket key={ticket.id} {...ticket} />)
      )}
    </div>
  );
};

MyTicketsPage.getInitialProps = async (context, client, currentUser) => {
  // Always fetch available tickets
  const availableResponse = await client.get("/api/tickets");

  let myTickets = [];

  // If user is logged in, fetch their purchased tickets
  if (currentUser) {
    try {
      const myTicketsResponse = await client.get("/api/tickets/my-tickets");
      myTickets = myTicketsResponse.data;
    } catch (e) {
      myTickets = [];
    }
  }

  return {
    availableTickets: availableResponse.data,
    myTickets,
    currentUser,
  };
};

export default MyTicketsPage;

"use client";

import { useEffect, useState } from "react";
import TicketManager from "@/app/components/admin/TicketManager";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tickets");
      const data = await response.json();

      if (data.success) {
        setTickets(data.tickets);
      } else {
        setError("Failed to load tickets");
      }
    } catch (err) {
      setError("Error loading tickets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading tickets...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <TicketManager 
      tickets={tickets} 
      onTicketsUpdate={fetchTickets}
    />
  );
}

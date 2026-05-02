"use client";

import { useState } from "react";

export default function TicketManager({ tickets, onTicketsUpdate }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isResponding, setIsResponding] = useState(false);
const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === "all" || ticket.status === filter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesCategory && matchesPriority && matchesSearch;
  });

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onTicketsUpdate();
      }
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

const handleResponse = async (ticketId) => {
    if (!responseText.trim()) {
      alert("Please enter a response message");
      return;
    }

    try {
      setIsResponding(true);
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          admin_response: responseText,
          status: "in_progress"
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResponseText("");
        setSelectedTicket(null);
        onTicketsUpdate();
        alert("Response sent successfully!");
      } else {
        alert(data.message || "Failed to send response");
      }
    } catch (error) {
      console.error("Failed to submit response:", error);
      alert("Error sending response. Please try again.");
    } finally {
      setIsResponding(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Management</h1>
        
{/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
<option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="bug_report">Bug Report</option>
            <option value="feature_request">Feature Request</option>
            <option value="complaint">Complaint</option>
            <option value="suggestion">Suggestion</option>
            <option value="other">Other</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tickets found
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{ticket.message}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Category:</span> {ticket.category} • 
                    <span className="font-medium ml-2">User:</span> {ticket.username || `ID: ${ticket.user_id}`}
                    {ticket.role && <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded">{ticket.role}</span>}
                  </div>
                  <div>
                    {formatDate(ticket.created_at)}
                  </div>
                </div>

                {ticket.admin_response && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-1">Admin Response:</p>
                    <p className="text-sm text-blue-800">{ticket.admin_response}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
<button
                    onClick={() => setSelectedTicket(ticket)}
                    className="px-3 py-1 text-sm bg-(--primary) text-white rounded hover:opacity-80 transition"
                  >
                    {ticket.admin_response ? "View Details" : "Respond"}
                  </button>
                  
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSelectedTicket(null)}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedTicket.admin_response ? "Ticket Details" : "Respond to Ticket"}
                </h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Subject:</p>
                  <p className="text-gray-900">{selectedTicket.subject}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Message:</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>

                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Category:</span> {selectedTicket.category}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Priority:</span> {selectedTicket.priority}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">User:</span> {selectedTicket.username || `ID: ${selectedTicket.user_id}`}
                    {selectedTicket.role && <span className="ml-2 text-xs px-2 py-1 bg-gray-100 rounded">{selectedTicket.role}</span>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span> {formatDate(selectedTicket.created_at)}
                  </div>
                </div>

                {selectedTicket.admin_response && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-1">Previous Admin Response:</p>
                    <p className="text-sm text-blue-800">{selectedTicket.admin_response}</p>
                  </div>
                )}

                {!selectedTicket.admin_response && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Response:
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response here..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                  >
                    {selectedTicket.admin_response ? "Close" : "Cancel"}
                  </button>
                  
                  {!selectedTicket.admin_response && (
<button
                      onClick={() => handleResponse(selectedTicket.id)}
                      disabled={isResponding || !responseText.trim()}
                      className="px-4 py-2 bg-(--primary) text-white rounded-md hover:opacity-80 transition disabled:opacity-50"
                    >
                      {isResponding ? "Sending..." : "Send Response"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

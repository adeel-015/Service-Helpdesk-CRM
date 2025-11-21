import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ApiService from "../services/api";
import TicketTable from "../components/dashboard/TicketTable";
import TicketFilters from "../components/tickets/TicketFilters";
import Pagination from "../components/common/Pagination";
import Modal from "../components/common/Modal";
import TicketForm from "../components/tickets/TicketForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const TicketsPage = () => {
  const { isAdmin, isAgent } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchTickets();
    if (isAdmin() || isAgent()) {
      fetchAgents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getTickets(filters);
      setTickets(response.tickets || []);
      setPagination(response.pagination || {});
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const users = await ApiService.getUsers("agent");
      setAgents(users);
    } catch (error) {
      console.error("Failed to load agents:", error);
    }
  };

  const handleCreateTicket = async (formData) => {
    try {
      await ApiService.createTicket(formData);
      setShowCreateModal(false);
      fetchTickets();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteTicket = async (id) => {
    await ApiService.deleteTicket(id);
    fetchTickets();
  };

  const handleAssignTicket = async (ticketId, agentId) => {
    await ApiService.assignTicket(ticketId, agentId);
    fetchTickets();
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  if (loading && !tickets.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading tickets..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">All Tickets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      <TicketFilters onFilterChange={setFilters} agents={agents} />

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Tickets</h2>
          {pagination.total > 0 && (
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <TicketTable
          tickets={tickets}
          onDelete={handleDeleteTicket}
          onAssign={handleAssignTicket}
          agents={agents}
        />
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Ticket"
        size="lg"
      >
        <TicketForm
          onSubmit={handleCreateTicket}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TicketsPage;

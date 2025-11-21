import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import ApiService from "../services/api";
import StatsCards from "../components/dashboard/StatsCards";
import ChartsSection from "../components/dashboard/ChartsSection";
import TicketTable from "../components/dashboard/TicketTable";
import TicketFilters from "../components/tickets/TicketFilters";
import Modal from "../components/common/Modal";
import TicketForm from "../components/tickets/TicketForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {
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

  const filtersRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd+N - new ticket
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setShowCreateModal(true);
      }

      // Ctrl/Cmd+R - refresh tickets
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        fetchTickets();
        toast.success("Refreshed tickets");
      }

      // Ctrl/Cmd+F - focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (
          filtersRef.current &&
          typeof filtersRef.current.focus === "function"
        ) {
          filtersRef.current.focus();
        }
      }

      // Escape - close create modal if open
      if (e.key === "Escape") {
        if (showCreateModal) setShowCreateModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCreateModal, filters]);

  const fetchTickets = async () => {
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

  const calculateStats = () => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to Service Helpdesk CRM. Shortcuts:{" "}
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
              Ctrl+N
            </kbd>{" "}
            create,&nbsp;
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
              Ctrl+R
            </kbd>{" "}
            refresh,&nbsp;
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
              Ctrl+F
            </kbd>{" "}
            focus search,
            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">
              Esc
            </kbd>{" "}
            close modal.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      <StatsCards stats={calculateStats()} />

      <ChartsSection tickets={tickets} />

      <TicketFilters
        ref={filtersRef}
        onFilterChange={setFilters}
        agents={agents}
      />

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Tickets</h2>
          {pagination.total > 0 && (
            <p className="text-sm text-gray-600">
              Showing {tickets.length} of {pagination.total} tickets
            </p>
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

export default DashboardPage;

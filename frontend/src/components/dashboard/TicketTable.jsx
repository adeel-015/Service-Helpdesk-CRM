import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import EmptyState from "../common/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const TicketTable = ({ tickets, onDelete, onAssign, agents = [] }) => {
  const navigate = useNavigate();
  const { isAdmin, isAgent, user } = useAuth();

  const [localTickets, setLocalTickets] = useState(tickets || []);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    ticketId: null,
    title: "",
  });

  useEffect(() => setLocalTickets(tickets || []), [tickets]);

  const handleDelete = (id, title) => {
    setDeleteConfirm({ isOpen: true, ticketId: id, title });
  };

  const confirmDelete = async () => {
    const { ticketId } = deleteConfirm;
    // Optimistic UI: remove locally first
    const previous = localTickets;
    setLocalTickets((t) => t.filter((x) => x._id !== ticketId));
    setDeleteConfirm({ isOpen: false, ticketId: null, title: "" });
    try {
      await onDelete(ticketId);
      toast.success("Ticket deleted successfully");
    } catch (error) {
      // revert
      setLocalTickets(previous);
      toast.error(error.message || "Failed to delete ticket");
    }
  };

  const handleAssign = async (ticketId, agentId) => {
    try {
      await onAssign(ticketId, agentId);
      toast.success("Ticket assigned successfully");
    } catch (error) {
      toast.error(error.message || "Failed to assign ticket");
    }
  };

  if (!localTickets || localTickets.length === 0) {
    return (
      <EmptyState
        icon={() => <div className="text-6xl">📋</div>}
        title="No tickets found"
        description="There are no tickets to display."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned To
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {localTickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                #{ticket._id.slice(-6)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                {ticket.title}
              </td>
              <td className="px-4 py-3 text-sm">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-sm">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {(isAdmin() || isAgent()) && agents.length > 0 ? (
                  <select
                    value={ticket.assignedAgent?._id || ""}
                    onChange={(e) => handleAssign(ticket._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  ticket.assignedAgent?.username || "Unassigned"
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {ticket.createdBy}
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {(isAdmin() || ticket.createdBy === user?.username) && (
                    <button
                      onClick={() => handleDelete(ticket._id, ticket.title)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() =>
          setDeleteConfirm({ isOpen: false, ticketId: null, title: "" })
        }
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default TicketTable;

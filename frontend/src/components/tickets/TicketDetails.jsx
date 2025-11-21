import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import ApiService from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import Modal from "../common/Modal";
import TicketForm from "./TicketForm";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchTicketDetails();
      await fetchActivityLogs();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const response = await ApiService.getTickets({ _id: id });
      if (response.tickets && response.tickets.length > 0) {
        setTicket(response.tickets[0]);
      }
    } catch (error) {
      toast.error("Failed to load ticket details");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const logs = await ApiService.getTicketActivity(id);
      setActivityLogs(logs);
    } catch (error) {
      console.error("Failed to load activity logs:", error);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await ApiService.updateTicket(id, formData);
      setShowEditModal(false);
      // Add small delay to ensure activity log is created
      setTimeout(async () => {
        await fetchTicketDetails();
        await fetchActivityLogs();
      }, 500);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading ticket details..." />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Ticket not found</p>
      </div>
    );
  }

  const canEdit = isAdmin() || isAgent() || ticket.createdBy === user?.username;

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Ticket
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Created By</p>
              <p className="text-sm font-medium text-gray-900">
                {ticket.createdBy}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Assigned To</p>
              <p className="text-sm font-medium text-gray-900">
                {ticket.assignedAgent?.username || "Unassigned"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Description
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Timeline
          </h2>
          {activityLogs.length > 0 ? (
            <div className="space-y-4">
              {activityLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex gap-4 border-l-2 border-gray-200 pl-4 pb-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {log.user?.username || "System"}
                      </span>{" "}
                      {log.action}{" "}
                      <span className="text-gray-500">{log.entityType}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                    {log.changes && (
                      <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No activity logs available</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Ticket"
        size="lg"
      >
        <TicketForm
          initialData={ticket}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TicketDetails;

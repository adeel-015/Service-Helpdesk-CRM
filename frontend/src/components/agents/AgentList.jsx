import { useState, useEffect } from "react";
import { Trash2, UserPlus } from "lucide-react";
import ApiService from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({
    isOpen: false,
    action: null,
    id: null,
    username: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const { isAdmin } = useAuth();

  const fetchUsers = async () => {
    try {
      const allUsers = await ApiService.getUsers();
      setAgents(allUsers.filter((u) => u.role === "agent"));
      setUsers(allUsers.filter((u) => u.role === "user"));
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    setConfirm({ isOpen: true, action: "delete", id, username });
  };

  const handlePromoteToAgent = async (id, username) => {
    setConfirm({ isOpen: true, action: "promote", id, username });
  };

  const confirmAction = async () => {
    const { action, id } = confirm;
    setConfirm((c) => ({ ...c, isOpen: false }));

    if (action === "delete") {
      // optimistic: remove agent locally first
      const previous = agents;
      setAgents((list) => list.filter((a) => a._id !== id));
      try {
        await ApiService.deleteUser(id);
        toast.success("Agent deleted successfully");
      } catch (error) {
        setAgents(previous);
        toast.error(error.message || "Failed to delete agent");
      }
      return;
    }

    if (action === "promote") {
      // optimistic: move user from users -> agents
      const prevUsers = users;
      const prevAgents = agents;
      const userToPromote = users.find((u) => u._id === id);
      if (!userToPromote) {
        toast.error("User not found");
        return;
      }
      const promoted = { ...userToPromote, role: "agent" };
      setUsers((list) => list.filter((u) => u._id !== id));
      setAgents((list) => [promoted, ...list]);
      try {
        await ApiService.updateUser(id, { role: "agent" });
        toast.success("User promoted to agent successfully");
      } catch (error) {
        setUsers(prevUsers);
        setAgents(prevAgents);
        toast.error(error.message || "Failed to promote user");
      }
      return;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading agents..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Agents</h2>
        {agents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {agent.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {agent.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {isAdmin() ? (
                        <button
                          onClick={() =>
                            handleDelete(agent._id, agent.username)
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete agent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Admin only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={() => <div className="text-6xl">👥</div>}
            title="No agents found"
            description="There are no agents in the system yet."
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Users (Promote to Agent)
        </h2>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {isAdmin() ? (
                        <button
                          onClick={() =>
                            handlePromoteToAgent(user._id, user.username)
                          }
                          className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Promote to agent"
                        >
                          <UserPlus className="w-4 h-4" />
                          Promote
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Admin only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No users available to promote</p>
        )}
      </div>
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={() => setConfirm((c) => ({ ...c, isOpen: false }))}
        onConfirm={confirmAction}
        title={
          confirm.action === "delete" ? `Confirm Delete` : `Confirm Promotion`
        }
        message={
          confirm.action === "delete"
            ? `Are you sure you want to delete "${confirm.username}"? This action cannot be undone.`
            : `Promote "${confirm.username}" to agent?`
        }
        confirmText={confirm.action === "delete" ? "Delete" : "Promote"}
        cancelText="Cancel"
        variant={confirm.action === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};

export default AgentList;

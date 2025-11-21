import { useState, useEffect } from "react";
import { Activity, Clock } from "lucide-react";
import ApiService from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";
import toast from "react-hot-toast";

const ActivityLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const data = await ApiService.getActivityLogs();
      setLogs(data);
    } catch (error) {
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      case "ASSIGN":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading activity logs..." />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity logs"
        description="There are no activity logs to display."
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Activity Logs
        </h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">
                        {log.user?.username || "System"}
                      </span>{" "}
                      performed{" "}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>{" "}
                      on <span className="font-medium">{log.entityType}</span>
                    </p>
                    {log.entityId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Entity ID: {log.entityId}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                {log.changes && Object.keys(log.changes).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                      View changes
                    </summary>
                    <pre className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogViewer;

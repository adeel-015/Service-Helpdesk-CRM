import React from "react";
import ActivityLogViewer from "../components/activity/ActivityLogViewer";

const ActivityLogsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-gray-600 mt-1">
          View all system activity and changes made by users.
        </p>
      </div>
      <ActivityLogViewer />
    </div>
  );
};

export default ActivityLogsPage;

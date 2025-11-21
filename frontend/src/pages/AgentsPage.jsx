import React from "react";
import AgentList from "../components/agents/AgentList";

const AgentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
        <p className="text-gray-600 mt-1">
          Manage system agents and promote users to agent role.
        </p>
      </div>
      <AgentList />
    </div>
  );
};

export default AgentsPage;

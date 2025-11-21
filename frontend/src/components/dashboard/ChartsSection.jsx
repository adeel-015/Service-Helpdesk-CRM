import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartsSection = ({ tickets = [] }) => {
  const statusData = [
    {
      name: "Open",
      value: tickets.filter((t) => t.status === "Open").length,
      color: "#3B82F6",
    },
    {
      name: "In Progress",
      value: tickets.filter((t) => t.status === "In Progress").length,
      color: "#F59E0B",
    },
    {
      name: "Resolved",
      value: tickets.filter((t) => t.status === "Resolved").length,
      color: "#10B981",
    }
  ];

  const priorityData = [
    { name: "Low", value: tickets.filter((t) => t.priority === "Low").length },
    {
      name: "Medium",
      value: tickets.filter((t) => t.priority === "Medium").length,
    },
    {
      name: "High",
      value: tickets.filter((t) => t.priority === "High").length,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ticket Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Priority Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" name="Tickets" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;

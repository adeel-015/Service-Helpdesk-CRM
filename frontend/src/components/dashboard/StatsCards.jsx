import React from "react";
import { Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Tickets",
      value: stats?.total || 0,
      icon: Ticket,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Open Tickets",
      value: stats?.open || 0,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: AlertCircle,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {card.value}
              </p>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      roles: ["admin", "agent", "user"],
    },
    {
      path: "/tickets",
      icon: Ticket,
      label: "Tickets",
      roles: ["admin", "agent", "user"],
    },
    {
      path: "/profile",
      icon: Users,
      label: "Profile",
      roles: ["admin", "agent", "user"],
    },
    { path: "/agents", icon: Users, label: "Agents", roles: ["admin"] },
    {
      path: "/activity-logs",
      icon: Activity,
      label: "Activity Logs",
      roles: ["admin", "agent"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-64 bg-gray-900 text-white flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Service Helpdesk CRM</h1>
          <p className="text-sm text-gray-400 mt-1">{user?.username}</p>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded mt-1 inline-block">
            {user?.role}
          </span>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile header and overlay menu */}
      <div className="md:hidden flex items-center justify-between p-3 bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileOpen((s) => !s)} className="p-2">
            {isMobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <div>
            <h1 className="text-lg font-bold">
              Service Helpdesk CRM
            </h1>
            <p className="text-xs text-gray-300">{user?.username}</p>
          </div>
        </div>
        <button onClick={logout} className="p-2">
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-40">
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 text-white p-4 overflow-auto">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">
                Service Helpdesk CRM
              </h1>
              <p className="text-sm text-gray-400 mt-1">{user?.username}</p>
            </div>
            <nav>
              <ul className="space-y-2">
                {filteredNavItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

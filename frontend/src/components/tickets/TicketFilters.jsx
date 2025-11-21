import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Search, Filter, X } from "lucide-react";

const TicketFilters = forwardRef(({ onFilterChange, agents = [] }, ref) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignedAgent: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (searchInputRef.current) searchInputRef.current.focus();
    },
  }));

  // debounce the search input before notifying parent
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Notify parent when filters change (debounced search)
  useEffect(() => {
    if (typeof onFilterChange === "function") {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.status, filters.priority, filters.assignedAgent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const clearFilters = () =>
    setFilters({ search: "", status: "", priority: "", assignedAgent: "" });

  const hasActiveFilters =
    !!filters.search || !!filters.status || !!filters.priority || !!filters.assignedAgent;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search tickets"
          />
        </div>

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {agents.length > 0 ? (
          <select
            name="assignedAgent"
            value={filters.assignedAgent}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter by assigned agent"
          >
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.username}
              </option>
            ))}
          </select>
        ) : (
          // keep layout consistent when no agents
          <div />
        )}
      </div>
    </div>
  );
});

TicketFilters.displayName = "TicketFilters";

export default TicketFilters;
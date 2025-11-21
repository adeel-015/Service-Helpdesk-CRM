import React, { useState } from "react";
import toast from "react-hot-toast";

const TicketForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    // Restrict to backend-accepted values
    priority: initialData?.priority || "Medium",
    status: initialData?.status || "Open",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation to avoid backend 400s
    if (!formData.title || formData.title.trim().length < 5) {
      return toast.error("Title must be at least 5 characters");
    }
    if (!formData.description || formData.description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters");
    }
    // Ensure values are within allowed enums
    const allowedPriorities = ["Low", "Medium", "High"];
    const allowedStatuses = ["Open", "In Progress", "Resolved"];
    if (!allowedPriorities.includes(formData.priority)) {
      return toast.error("Invalid priority selected");
    }
    if (!allowedStatuses.includes(formData.status)) {
      return toast.error("Invalid status selected");
    }

    try {
      await onSubmit(formData);
      toast.success(
        initialData
          ? "Ticket updated successfully"
          : "Ticket created successfully"
      );
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength="5"
          maxLength="200"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.title.length}/200 characters (minimum 5)
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          minLength="10"
          maxLength="2000"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.description.length}/2000 characters (minimum 10)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {initialData ? "Update Ticket" : "Create Ticket"}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;

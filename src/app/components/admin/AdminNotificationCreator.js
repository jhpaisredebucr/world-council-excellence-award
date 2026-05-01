"use client";

import { useState } from "react";

export default function AdminNotificationCreator({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    target: "all",
    userIds: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target: formData.target
      };

      if (formData.target === "specific") {
        if (!formData.userIds.trim()) {
          setError("User IDs are required for specific targeting");
          setLoading(false);
          return;
        }
        payload.userIds = formData.userIds.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        
        if (payload.userIds.length === 0) {
          setError("Please enter valid user IDs (comma-separated numbers)");
          setLoading(false);
          return;
        }
      }

      if (formData.target === "role") {
        if (!formData.role.trim()) {
          setError("Role is required for role-based targeting");
          setLoading(false);
          return;
        }
        payload.role = formData.role;
      }

      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Successfully created ${data.notifications.length} notification(s)`);
        // Reset form
        setFormData({
          title: "",
          message: "",
          type: "info",
          target: "all",
          userIds: "",
          role: ""
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(data.message || "Failed to create notifications");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Create Notification</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification title"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notification message"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Target */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience *
          </label>
          <select
            name="target"
            value={formData.target}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="specific">Specific Users</option>
            <option value="role">Users by Role</option>
          </select>
        </div>

        {/* Conditional fields based on target */}
        {formData.target === "specific" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User IDs (comma-separated) *
            </label>
            <input
              type="text"
              name="userIds"
              value={formData.userIds}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1, 2, 3, 4"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter user IDs separated by commas
            </p>
          </div>
        )}

        {formData.target === "role" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., member, admin, moderator"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the role name to target
            </p>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Notification"}
          </button>
        </div>
      </form>
    </div>
  );
}

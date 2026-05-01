"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationItem({ notification, onRead, onDelete, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-800",
          dot: "bg-green-500"
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          dot: "bg-yellow-500"
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          dot: "bg-red-500"
        };
      case "system":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          dot: "bg-blue-500"
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          dot: "bg-gray-500"
        };
    }
  };

  const styles = getTypeStyles(notification.type);
  const isUnread = !notification.read;
  
  const handleMarkAsRead = async () => {
    if (isUnread) {
      await onRead(notification.id);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this notification?")) {
      await onDelete(notification.id);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown time";
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-lg border transition-all cursor-pointer
        ${styles.bg} ${styles.border}
        ${isUnread ? "shadow-sm" : "opacity-75"}
        hover:shadow-md
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Unread indicator dot */}
      {isUnread && (
        <div
          className={`absolute top-4 right-4 w-2 h-2 rounded-full ${styles.dot}`}
        />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${styles.text}`}>
            {notification.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatDate(notification.created_at)}
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <span className={`text-xs px-2 py-1 rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}>
            {notification.type}
          </span>
        </div>
      </div>

      {/* Message content */}
      <div className={`mt-3 ${isExpanded ? "block" : "line-clamp-2"}`}>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {notification.message}
        </p>
      </div>

      {/* Action buttons */}
      {isExpanded && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
          {isUnread && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
              className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Mark as Read
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

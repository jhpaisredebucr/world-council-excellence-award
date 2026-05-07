"use client";

import { useState, useEffect } from "react";
import NotificationsModal from "./NotificationsModal";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/notifications?limit=5");
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.notifications.filter(n => !n.read).length);
        setRecentNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setRecentNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleToggleExpand = (notificationId, e) => {
    e.stopPropagation();
    setExpandedId(prev => prev === notificationId ? null : notificationId);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return `${Math.floor(diffMins / 1440)}d ago`;
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed sm:absolute inset-x-2 sm:inset-x-auto sm:right-0 top-1/2 sm:top-auto sm:mt-2 -translate-y-1/2 sm:translate-y-0 w-[calc(100vw-1rem)] sm:w-80 max-w-none sm:max-w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs sm:text-sm text-blue-600 whitespace-nowrap">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>
            
            <div className="max-h-72 sm:max-h-96 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map((notification) => {
                    const isExpanded = expandedId === notification.id;
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm sm:text-base font-medium truncate ${
                              !notification.read ? "text-gray-900" : "text-gray-600"
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-xs sm:text-sm text-gray-500 mt-1 wrap-break-word ${
                              isExpanded ? "whitespace-pre-wrap" : "line-clamp-2"
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mt-2">
                              <p className="text-xs text-gray-400">
                                {formatDate(notification.created_at)}
                              </p>
                              <button
                                onClick={(e) => handleToggleExpand(notification.id, e)}
                                className="text-xs text-gray-400 hover:text-gray-500 font-medium py-1 px-2 rounded hover:bg-gray-100 transition min-h-8"
                              >
                                {isExpanded ? "Show less" : "Read more"}
                              </button>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="ml-2 mt-1 shrink-0">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {recentNotifications.length > 0 && (
              <div className="p-3 sm:p-3 border-t border-gray-200">
                <button
                  className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 transition py-2 px-3 rounded hover:bg-blue-50 min-h-11"
                  onClick={() => {
                    setIsOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
      
      <NotificationsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

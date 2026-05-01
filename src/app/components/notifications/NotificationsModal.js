"use client";

import { useState, useEffect } from "react";

export default function NotificationsModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0
  });

  const fetchNotifications = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pageNum,
        limit: 10
      });

      if (filterUnreadOnly) {
        params.append("unreadOnly", "true");
      }

      const response = await fetch(`/api/notifications?${params}`);
      const data = await response.json();

      if (data.success) {
        if (append) {
          setNotifications(prev => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
          updateStats(data.notifications);
        }
        
        setHasMore(pageNum < data.pagination.totalPages);
        setPage(pageNum);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (notificationList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayNotifications = notificationList.filter(n => 
      new Date(n.created_at) >= today
    );
    
    setStats({
      total: notificationList.length,
      unread: notificationList.filter(n => !n.read).length,
      today: todayNotifications.length
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filterUnreadOnly]);

  const handleMarkAsRead = async (notificationId) => {
    console.log(`Marking notification ${notificationId} as read`);
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      console.log(`Response status: ${response.status}`);
      
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
        console.log("Successfully marked as read and updated state");
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev =>
          prev.filter(notification => notification.id !== notificationId)
        );
        if (deletedNotification && !deletedNotification.read) {
          setStats(prev => ({
            ...prev,
            unread: Math.max(0, prev.unread - 1),
            total: Math.max(0, prev.total - 1)
          }));
        } else {
          setStats(prev => ({
            ...prev,
            total: Math.max(0, prev.total - 1)
          }));
        }
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    for (const notification of unreadNotifications) {
      await handleMarkAsRead(notification.id);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, true);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "system":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Notifications</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-600">
                    Total: <span className="font-medium">{stats.total}</span>
                  </span>
                  <span className="text-sm text-orange-600">
                    Unread: <span className="font-medium">{stats.unread}</span>
                  </span>
                  <span className="text-sm text-green-600">
                    Today: <span className="font-medium">{stats.today}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {stats.unread > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Mark All as Read
                  </button>
                )}
                <button
                  onClick={() => fetchNotifications(1, false)}
                  className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Refresh
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="modalUnreadOnly"
                  checked={filterUnreadOnly}
                  onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="modalUnreadOnly" className="text-sm text-gray-700">
                  Show unread only
                </label>
              </div>
              <button
                onClick={() => {
                  setFilterUnreadOnly(false);
                  fetchNotifications(1, false);
                }}
                className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {loading && notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium mb-2">No notifications found</p>
                <p className="text-sm">You're all caught up! Check back later for new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-4 transition-colors ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getTypeStyles(notification.type)}`}>
                            {notification.type}
                          </span>
                          {!notification.read && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span>
                            <strong>Date:</strong> {formatDate(notification.created_at)}
                          </span>
                          <span>
                            <strong>ID:</strong> {notification.id}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {hasMore && (
              <div className="p-4 text-center border-t border-gray-200">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

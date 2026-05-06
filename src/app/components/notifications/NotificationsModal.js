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
    console.log(`Type of notificationId: ${typeof notificationId}`);
    console.log(`Is notificationId valid: ${!notificationId || isNaN(parseInt(notificationId))}`);
    
    if (!notificationId || isNaN(parseInt(notificationId))) {
        console.error(`Invalid notificationId passed to handleMarkAsRead: ${notificationId}`);
        return;
    }
    
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
    console.log(`Deleting notification ${notificationId}`);
    console.log(`Type of notificationId: ${typeof notificationId}`);
    
    if (!notificationId || isNaN(parseInt(notificationId))) {
        console.error(`Invalid notificationId passed to handleDelete: ${notificationId}`);
        return;
    }
    
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
    
    console.log(`Marking ${unreadNotifications.length} notifications as read`);
    
    for (const notification of unreadNotifications) {
      console.log(`Processing notification:`, notification);
      console.log(`Notification ID: ${notification.id}, Type: ${typeof notification.id}`);
      
      if (!notification.id || isNaN(parseInt(notification.id))) {
        console.error(`Skipping notification with invalid ID: ${notification.id}`);
        continue;
      }
      
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
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl sm:max-w-3xl md:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2 sm:mx-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">My Notifications</h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Total: <span className="font-medium">{stats.total}</span>
                  </span>
                  <span className="text-xs sm:text-sm text-orange-600">
                    Unread: <span className="font-medium">{stats.unread}</span>
                  </span>
                  <span className="text-xs sm:text-sm text-green-600">
                    Today: <span className="font-medium">{stats.today}</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {stats.unread > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition min-w-0"
                  >
                    <span className="hidden sm:inline">Mark All as Read</span>
                    <span className="sm:hidden">All Read</span>
                  </button>
                )}
                <button
                  onClick={() => fetchNotifications(1, false)}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 sm:p-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="modalUnreadOnly"
                  checked={filterUnreadOnly}
                  onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="modalUnreadOnly" className="text-xs sm:text-sm text-gray-700">
                  Show unread only
                </label>
              </div>
              <button
                onClick={() => {
                  setFilterUnreadOnly(false);
                  fetchNotifications(1, false);
                }}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition self-start"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
            {loading && notifications.length === 0 ? (
              <div className="p-12">
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '300px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin mb-4"></div>
                  <p className="text-xl text-gray-700">Loading notifications...</p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 sm:p-12 text-center text-gray-500">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-base sm:text-lg font-medium mb-2">No notifications found</p>
                <p className="text-xs sm:text-sm">You're all caught up! Check back later for new notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 sm:p-4 transition-colors ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h4 className={`text-sm sm:text-base font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'} truncate`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getTypeStyles(notification.type)}`}>
                              {notification.type}
                            </span>
                            {!notification.read && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 whitespace-pre-wrap break-word">
                          {notification.message}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-2">
                          <span>
                            <strong>Date:</strong> <span className="break-all">{formatDate(notification.created_at)}</span>
                          </span>
                          <span className="hidden sm:inline">
                            <strong>ID:</strong> {notification.id}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition min-h-8"
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition min-h-8"
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
              <div className="p-3 sm:p-4 text-center border-t border-gray-200">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 min-h-10"
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

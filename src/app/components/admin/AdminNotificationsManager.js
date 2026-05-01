"use client";

import { useState, useEffect } from "react";
import AdminNotificationCreator from "./AdminNotificationCreator";

export default function AdminNotificationsManager() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterUserId, setFilterUserId] = useState("");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
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
        limit: 20
      });

      if (filterUserId) {
        params.append("userId", filterUserId);
      }

      if (filterUnreadOnly) {
        params.append("unreadOnly", "true");
      }

      const response = await fetch(`/api/admin/notifications?${params}`);
      const data = await response.json();

      if (data.success) {
        if (append) {
          setNotifications(prev => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
          // Update stats when fetching fresh data
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
    fetchNotifications();
  }, [filterUserId, filterUnreadOnly]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotifications(1, false);
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

  const getUserName = (notification) => {
    if (notification.first_name && notification.last_name) {
      return `${notification.first_name} ${notification.last_name}`;
    }
    return notification.username || `User ID: ${notification.user_id}`;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Notifications</h1>
        <p className="text-gray-600">Create and manage notifications for all users</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-orange-600">{stats.unread}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.today}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "create"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Create Notification
            </button>
            <button
              onClick={() => setActiveTab("view")}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "view"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View Notifications
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "create" && (
            <AdminNotificationCreator onSuccess={() => {
              fetchNotifications(1, false);
              setActiveTab("view");
            }} />
          )}
          
          {activeTab === "view" && (
            <div>
              {/* Filters */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <form onSubmit={handleFilterSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Filter by User ID"
                      value={filterUserId}
                      onChange={(e) => setFilterUserId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      Apply Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterUserId("");
                        setFilterUnreadOnly(false);
                        fetchNotifications(1, false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="unreadOnly"
                      checked={filterUnreadOnly}
                      onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="unreadOnly" className="text-sm text-gray-700">
                      Show unread only
                    </label>
                  </div>
                </form>
              </div>

              {/* Notifications List */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Notifications ({notifications.length})
                    </h3>
                    <button
                      onClick={() => fetchNotifications(1, false)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                
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
                    <p className="text-sm">Try adjusting your filters or create a new notification</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getTypeStyles(notification.type)}`}>
                                {notification.type}
                              </span>
                              {!notification.read && (
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                  Unread
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>
                                <strong>User:</strong> {getUserName(notification)}
                              </span>
                              <span>
                                <strong>Date:</strong> {formatDate(notification.created_at)}
                              </span>
                              <span>
                                <strong>ID:</strong> {notification.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {hasMore && (
                  <div className="p-6 text-center border-t border-gray-200">
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
          )}
        </div>
      </div>
    </div>
  );
}

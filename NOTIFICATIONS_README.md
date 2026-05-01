# Notifications System Implementation

This document provides a comprehensive overview of the notifications system implemented for the WCEA platform.

## Overview

The notifications system provides real-time notification management for users, including:
- Creating and storing notifications
- Viewing notifications with pagination
- Marking notifications as read/unread
- Deleting notifications
- Real-time notification bell with unread count
- Notification templates for common events

## Database Schema

### Notifications Table

```sql
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '"Untitled"',
    message TEXT NOT NULL DEFAULT '"No Message"',
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Schema Updates

The following SQL file should be run to update your database:
- `notifications-schema.sql` - Adds missing columns and indexes

## API Endpoints

### User Notifications

#### GET /api/notifications
Fetch notifications for the authenticated user with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "notifications": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### POST /api/notifications
Create a new notification for the authenticated user.

**Request Body:**
```json
{
  "title": "Notification Title",
  "message": "Notification message",
  "type": "info" // optional: info, success, warning, error, system
}
```

**Response:**
```json
{
  "success": true,
  "notification": {...}
}
```

#### PUT /api/notifications/[id]
Update a notification (mark as read, update content).

**Request Body:**
```json
{
  "read": true, // optional
  "title": "Updated Title", // optional
  "message": "Updated Message", // optional
  "type": "success" // optional
}
```

#### DELETE /api/notifications/[id]
Delete a notification.

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Admin Notifications (Admin Only)

#### POST /api/admin/notifications
Create notifications for multiple users (admin only).

**Request Body:**
```json
{
  "title": "Notification Title",
  "message": "Notification message",
  "type": "info", // optional: info, success, warning, error, system
  "target": "all", // required: "all", "specific", or "role"
  "userIds": [1, 2, 3], // required if target is "specific"
  "role": "member" // required if target is "role"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notifications created successfully for 5 user(s)",
  "notifications": [...]
}
```

#### GET /api/admin/notifications
Fetch all notifications with user information (admin only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `userId` (optional): Filter by specific user ID
- `unreadOnly` (optional): Show only unread notifications

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "title": "Notification Title",
      "message": "Message",
      "type": "info",
      "read": false,
      "created_at": "2024-01-01T00:00:00Z",
      "user_id": 1,
      "username": "john_doe",
      "first_name": "John",
      "last_name": "Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Frontend Components

### NotificationBell (`/src/app/components/notifications/NotificationBell.js`)
- Displays notification icon with unread count badge
- Dropdown showing recent notifications
- Auto-refreshes every 30 seconds
- Click to mark as read functionality

**Usage:**
```jsx
import NotificationBell from "@/app/components/notifications/NotificationBell";

<NotificationBell />
```

### NotificationsList (`/src/app/components/notifications/NotificationsList.js`)
- Full notification management interface
- Pagination support
- Mark all as read functionality
- Expandable notification items

**Usage:**
```jsx
import NotificationsList from "@/app/components/notifications/NotificationsList";

<NotificationsList />
```

### NotificationItem (`/src/app/components/notifications/NotificationItem.js`)
- Individual notification component
- Type-based styling (info, success, warning, error, system)
- Expand/collapse functionality
- Action buttons (mark as read, delete)

### AdminNotificationCreator (`/src/app/components/admin/AdminNotificationCreator.js`)
- Admin-only notification creation form
- Support for targeting all users, specific users, or users by role
- Real-time validation and error handling
- Success feedback with notification count

### AdminNotificationsManager (`/src/app/components/admin/AdminNotificationsManager.js`)
- Complete admin notification management interface
- Filters for user ID and unread status
- View all notifications with user information
- Pagination support
- Integrated with AdminNotificationCreator

## Utility Functions

### Notification Helper (`/src/lib/notifications.js`)

Provides server-side utility functions:

```javascript
import { createNotification, getUnreadCount, markAsRead } from "@/lib/notifications";

// Create notification
await createNotification(userId, "Title", "Message", "success");

// Get unread count
const count = await getUnreadCount(userId);

// Mark as read
await markAsRead(notificationId, userId);
```

### Notification Templates

Pre-built notification templates for common events:

```javascript
import { notificationTemplates } from "@/lib/notifications";

// Welcome notification
const welcome = notificationTemplates.welcome("John");

// Payment notification
const payment = notificationTemplates.paymentReceived(100.00);
```

## Pages

### Notifications Page (`/src/app/notifications/page.js`)
Dedicated page for viewing all notifications with full management capabilities.

Access at: `/notifications`

### Admin Notifications Page (`/src/app/admin/notifications/page.js`)
Admin-only page for creating and managing notifications for all users.

Access at: `/admin/notifications`

## Installation & Setup

### 1. Database Setup

Run the schema update script:
```bash
psql -d your_database -f notifications-schema.sql
```

### 2. Environment Variables

Ensure your `.env.local` file contains:
```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Dependencies

The system uses these additional packages:
- `date-fns` - Date formatting
- `react-use` - React hooks (already installed)

## Styling & Theming

The notification components use CSS custom properties defined in `globals.css`:

```css
:root {
  --success-color: #83ff83;
  --error-color: #ff6a6a;
  --warn-color: #ffd883;
  --neutral-color: #83aeff;
}
```

## Testing

### User Notifications Test

A test script is provided at `test-notifications.js`:

```javascript
// In browser console
testNotifications.runAllTests();
```

This will:
1. Create a test notification
2. Fetch all notifications
3. Mark as read
4. Delete notification
5. Verify deletion

### Admin Notifications Test

A test script is provided at `test-admin-notifications.js`:

```javascript
// In browser console
testAdminNotifications.runAllTests();
```

This will:
1. Test error cases (unauthorized, invalid targets)
2. Create notification for all users
3. Create notification for specific users
4. Create notification for users by role
5. Fetch admin notifications with filters
6. Test current user notifications

### Quick Test Commands

```javascript
// Test admin notification creation for all users
testAdminNotifications.createNotificationForAll();

// Test admin notification creation for specific users
testAdminNotifications.createNotificationForSpecific([1, 2, 3]);

// Test admin notification creation by role
testAdminNotifications.createNotificationForRole('member');

// Check current user's notifications
testAdminNotifications.testCurrentUserNotifications();
```

## Integration Examples

### Adding Notification Bell to Layout

```jsx
// In your layout component
import NotificationBell from "@/app/components/notifications/NotificationBell";

export default function YourLayout({ children }) {
  return (
    <div>
      <header>
        <NotificationBell />
        {/* other header content */}
      </header>
      <main>{children}</main>
    </div>
  );
}
```

### Creating Notifications from Events

```javascript
// After successful payment
import { createNotification } from "@/lib/notifications";

await createNotification(
  userId,
  "Payment Successful",
  `Your payment of $${amount} has been processed.`,
  "success"
);
```

## Security Considerations

- All API endpoints require JWT authentication
- Users can only access their own notifications
- Input validation on all endpoints
- SQL injection protection via parameterized queries

## Performance Optimizations

- Database indexes on frequently queried fields
- Pagination to prevent loading large datasets
- Efficient polling for real-time updates
- Lazy loading of notification content

## Future Enhancements

Potential improvements for the notification system:

1. **Push Notifications**: Web push API support
2. **Email Notifications**: Integration with email service
3. **Notification Categories**: Grouping and filtering
4. **Scheduled Notifications**: Time-based delivery
5. **Notification Preferences**: User customization
6. **Real-time Updates**: WebSocket integration
7. **Analytics**: Notification engagement tracking

## Troubleshooting

### Common Issues

1. **Notifications not showing**: Check database schema and user authentication
2. **Unread count incorrect**: Verify the `read` field updates properly
3. **Styling issues**: Ensure CSS custom properties are defined
4. **API errors**: Check JWT token and database connection

### Debug Mode

Add console logging to debug:
```javascript
// In API routes
console.log("Notification data:", notification);

// In components
console.log("Notifications state:", notifications);
```

## Support

For issues or questions about the notifications system:
1. Check this documentation
2. Review the test script output
3. Verify database schema
4. Check browser console for errors

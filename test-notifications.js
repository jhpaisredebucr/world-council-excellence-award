// Test script for notifications system
// Run this in the browser console or as part of your testing

const API_BASE = '/api/notifications';

// Test functions
const testNotifications = {
  // Test creating a notification
  async createTestNotification() {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
          type: 'info'
        })
      });
      
      const data = await response.json();
      console.log('Create notification result:', data);
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  },

  // Test fetching notifications
  async fetchNotifications() {
    try {
      const response = await fetch(API_BASE);
      const data = await response.json();
      console.log('Fetch notifications result:', data);
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  },

  // Test marking as read
  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE}/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true })
      });
      
      const data = await response.json();
      console.log('Mark as read result:', data);
      return data;
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },

  // Test deleting a notification
  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${API_BASE}/${notificationId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      console.log('Delete notification result:', data);
      return data;
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting notification system tests...\n');
    
    // 1. Create a test notification
    console.log('1. Creating test notification...');
    const createResult = await this.createTestNotification();
    
    if (createResult?.success) {
      const notificationId = createResult.notification.id;
      
      // 2. Fetch notifications
      console.log('\n2. Fetching notifications...');
      await this.fetchNotifications();
      
      // 3. Mark as read
      console.log('\n3. Marking notification as read...');
      await this.markAsRead(notificationId);
      
      // 4. Delete notification
      console.log('\n4. Deleting notification...');
      await this.deleteNotification(notificationId);
      
      // 5. Fetch again to verify deletion
      console.log('\n5. Fetching notifications after deletion...');
      await this.fetchNotifications();
    }
    
    console.log('\n✅ Tests completed!');
  }
};

// Make it available globally for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testNotifications = testNotifications;
  console.log('🔔 Test functions available as: testNotifications.runAllTests()');
}

// Export for use in other files
export default testNotifications;

// Test script for admin notifications system
// Run this in the browser console or as part of your testing

const ADMIN_API_BASE = '/api/admin/notifications';

// Test functions for admin notifications
const testAdminNotifications = {
  // Test creating notification for all users
  async createNotificationForAll() {
    try {
      const response = await fetch(ADMIN_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Admin Test - All Users',
          message: 'This is a test notification sent to all users at ' + new Date().toLocaleTimeString(),
          type: 'info',
          target: 'all'
        })
      });
      
      const data = await response.json();
      console.log('Create notification for all users result:', data);
      return data;
    } catch (error) {
      console.error('Error creating notification for all users:', error);
    }
  },

  // Test creating notification for specific users
  async createNotificationForSpecific(userIds = [1, 2]) {
    try {
      const response = await fetch(ADMIN_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Admin Test - Specific Users',
          message: `This is a test notification sent to specific users: ${userIds.join(', ')}`,
          type: 'success',
          target: 'specific',
          userIds: userIds
        })
      });
      
      const data = await response.json();
      console.log('Create notification for specific users result:', data);
      return data;
    } catch (error) {
      console.error('Error creating notification for specific users:', error);
    }
  },

  // Test creating notification for users by role
  async createNotificationForRole(role = 'member') {
    try {
      const response = await fetch(ADMIN_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Admin Test - Role Based',
          message: `This is a test notification sent to all users with role: ${role}`,
          type: 'warning',
          target: 'role',
          role: role
        })
      });
      
      const data = await response.json();
      console.log('Create notification for role result:', data);
      return data;
    } catch (error) {
      console.error('Error creating notification for role:', error);
    }
  },

  // Test fetching admin notifications
  async fetchAdminNotifications(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.unreadOnly) params.append('unreadOnly', filters.unreadOnly);

      const response = await fetch(`${ADMIN_API_BASE}?${params}`);
      const data = await response.json();
      console.log('Fetch admin notifications result:', data);
      return data;
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    }
  },

  // Test error cases
  async testErrorCases() {
    console.log('\n🧪 Testing error cases...');
    
    // Test without authentication (should fail)
    try {
      const response = await fetch(ADMIN_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test',
          message: 'Test'
        })
      });
      
      const data = await response.json();
      console.log('❌ No auth test:', data.success === false ? '✅ Passed' : '❌ Failed');
    } catch (error) {
      console.log('❌ No auth test: Error');
    }

    // Test invalid target
    try {
      const response = await fetch(ADMIN_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test',
          message: 'Test',
          target: 'invalid'
        })
      });
      
      const data = await response.json();
      console.log('❌ Invalid target test:', data.success === false ? '✅ Passed' : '❌ Failed');
    } catch (error) {
      console.log('❌ Invalid target test: Error');
    }

    // Test missing required fields
    try {
      const response = await fetch(ADMIN_API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test'
          // Missing title
        })
      });
      
      const data = await response.json();
      console.log('❌ Missing title test:', data.success === false ? '✅ Passed' : '❌ Failed');
    } catch (error) {
      console.log('❌ Missing title test: Error');
    }
  },

  // Run all admin tests
  async runAllTests() {
    console.log('🧪 Starting admin notification system tests...\n');
    
    // Test error cases first
    await this.testErrorCases();
    
    console.log('\n📝 Testing notification creation...');
    
    // 1. Create notification for all users
    console.log('1. Creating notification for all users...');
    await this.createNotificationForAll();
    
    // 2. Create notification for specific users
    console.log('\n2. Creating notification for specific users...');
    await this.createNotificationForSpecific([1, 2]);
    
    // 3. Create notification for role-based users
    console.log('\n3. Creating notification for role-based users...');
    await this.createNotificationForRole('member');
    
    console.log('\n📋 Testing notification fetching...');
    
    // 4. Fetch all admin notifications
    console.log('4. Fetching all admin notifications...');
    await this.fetchAdminNotifications();
    
    // 5. Fetch with filters
    console.log('\n5. Fetching with filters...');
    await this.fetchAdminNotifications({ 
      limit: 5, 
      unreadOnly: true 
    });
    
    console.log('\n✅ Admin notification tests completed!');
  },

  // Quick test for current user's notifications
  async testCurrentUserNotifications() {
    console.log('🔔 Testing current user notifications...');
    
    try {
      // Fetch user notifications
      const userResponse = await fetch('/api/notifications');
      const userData = await userResponse.json();
      
      console.log('User notifications:', userData);
      
      if (userData.success) {
        console.log(`Found ${userData.notifications.length} notifications`);
        console.log(`Unread count: ${userData.notifications.filter(n => !n.read).length}`);
      }
    } catch (error) {
      console.error('Error fetching user notifications:', error);
    }
  }
};

// Make it available globally for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testAdminNotifications = testAdminNotifications;
  console.log('🔔 Admin test functions available as: testAdminNotifications.runAllTests()');
  console.log('👤 User notification test available as: testAdminNotifications.testCurrentUserNotifications()');
}

// Export for use in other files
export default testAdminNotifications;

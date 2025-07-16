// Mock notification service for handling task reminders and notifications
let notifications = [];
let preferences = {
  emailEnabled: true,
  inAppEnabled: true,
  reminderDays: [1, 3, 7] // Default reminder intervals
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async getPreferences() {
    await delay(200);
    return { ...preferences };
  },

  async updatePreferences(newPreferences) {
    await delay(300);
    preferences = { ...preferences, ...newPreferences };
    return { ...preferences };
  },

  async sendNotification(type, data) {
    await delay(250);
    const notification = {
      Id: Date.now(),
      type,
      data,
      sentAt: new Date().toISOString(),
      read: false
    };
    notifications.push(notification);
    
    // In a real app, this would trigger actual notifications
    console.log(`Notification sent: ${type}`, data);
    return notification;
  },

  async getNotifications() {
    await delay(200);
    return [...notifications].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
  },

  async markAsRead(notificationId) {
    await delay(150);
    const notification = notifications.find(n => n.Id === parseInt(notificationId));
    if (notification) {
      notification.read = true;
    }
    return notification;
  },

  async sendTaskReminder(taskId, taskData, daysUntilDue) {
    const reminderText = daysUntilDue === 0 
      ? `Task "${taskData.title}" is due today!`
      : `Task "${taskData.title}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`;

    return this.sendNotification('task_reminder', {
      taskId,
      title: 'Task Reminder',
      message: reminderText,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      daysUntilDue
    });
  },

  async sendOverdueNotification(taskId, taskData, daysOverdue) {
    const overdueText = `Task "${taskData.title}" is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue!`;
    
    return this.sendNotification('task_overdue', {
      taskId,
      title: 'Overdue Task',
      message: overdueText,
      priority: 'high',
      dueDate: taskData.dueDate,
      daysOverdue
    });
  }
};
import { notificationService } from "./notificationService";
import { taskService } from "./taskService";

let reminders = [];
let reminderIntervals = new Map(); // Store active reminder intervals

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reminderService = {
  async scheduleReminder(taskId, reminderData) {
    await delay(300);
    
    const reminder = {
      Id: Date.now(),
      taskId: parseInt(taskId),
      type: reminderData.type,
      daysInAdvance: reminderData.daysInAdvance || 1,
      notificationMethods: reminderData.notificationMethods || ['in-app'],
      active: true,
      createdAt: new Date().toISOString()
    };
    
    reminders.push(reminder);
    this.startReminderMonitoring(reminder);
    
    return reminder;
  },

  async updateReminder(taskId, reminderData) {
    await delay(250);
    
    // Remove existing reminder
    await this.cancelReminder(taskId);
    
    // Create new reminder
    return this.scheduleReminder(taskId, reminderData);
  },

  async cancelReminder(taskId) {
    await delay(200);
    
    const reminderIndex = reminders.findIndex(r => r.taskId === parseInt(taskId));
    if (reminderIndex !== -1) {
      const reminder = reminders[reminderIndex];
      reminder.active = false;
      
      // Clear monitoring interval
      if (reminderIntervals.has(reminder.Id)) {
        clearInterval(reminderIntervals.get(reminder.Id));
        reminderIntervals.delete(reminder.Id);
      }
      
      return true;
    }
    return false;
  },

  async getRemindersByTask(taskId) {
    await delay(150);
    return reminders.filter(r => r.taskId === parseInt(taskId) && r.active);
  },

  startReminderMonitoring(reminder) {
    // Check every hour for due tasks
    const interval = setInterval(async () => {
      try {
        const task = await taskService.getById(reminder.taskId);
        if (!task || task.completed) {
          // Task completed or deleted, cancel reminder
          this.cancelReminder(reminder.taskId);
          return;
        }

        const now = new Date();
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Send reminder if within specified days
        if (daysDiff <= reminder.daysInAdvance && daysDiff >= 0) {
          await notificationService.sendTaskReminder(
            reminder.taskId,
            task,
            daysDiff
          );
          
          // For same-day reminders, keep checking
          if (daysDiff > 0) {
            this.cancelReminder(reminder.taskId);
          }
        }
        
        // Send overdue notification if task is past due
        if (daysDiff < 0) {
          await notificationService.sendOverdueNotification(
            reminder.taskId,
            task,
            Math.abs(daysDiff)
          );
        }
        
      } catch (error) {
        console.error('Error in reminder monitoring:', error);
      }
    }, 3600000); // Check every hour

    reminderIntervals.set(reminder.Id, interval);
  },

  async getActiveReminders() {
    await delay(200);
    return reminders.filter(r => r.active);
  },

  // Initialize reminder monitoring for existing reminders on service load
  async initializeReminderMonitoring() {
    const activeReminders = await this.getActiveReminders();
    activeReminders.forEach(reminder => {
      this.startReminderMonitoring(reminder);
    });
  }
};

// Auto-initialize when service loads
reminderService.initializeReminderMonitoring();
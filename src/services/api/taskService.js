const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c === "true",
        completedAt: task.completed_at_c,
        category: task.category_c,
        farmId: task.farm_id_c,
        cropId: task.crop_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('task_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return {
        Id: response.data.Id,
        title: response.data.title_c,
        description: response.data.description_c,
        dueDate: response.data.due_date_c,
        priority: response.data.priority_c,
        completed: response.data.completed_c === "true",
        completedAt: response.data.completed_at_c,
        category: response.data.category_c,
        farmId: response.data.farm_id_c,
        cropId: response.data.crop_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(taskData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: "false",
          category_c: taskData.category,
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };
      
      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c,
            description: task.description_c,
            dueDate: task.due_date_c,
            priority: task.priority_c,
            completed: task.completed_c === "true",
            completedAt: task.completed_at_c,
            category: task.category_c,
            farmId: task.farm_id_c,
            cropId: task.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, taskData) {
    await delay(350);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          category_c: taskData.category,
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c,
            description: task.description_c,
            dueDate: task.due_date_c,
            priority: task.priority_c,
            completed: task.completed_c === "true",
            completedAt: task.completed_at_c,
            category: task.category_c,
            farmId: task.farm_id_c,
            cropId: task.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async toggleComplete(id) {
    await delay(200);
    try {
      // First get the current task
      const task = await this.getById(id);
      if (!task) {
        throw new Error("Task not found");
      }
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const newCompleted = !task.completed;
      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: newCompleted ? "true" : "false",
          completed_at_c: newCompleted ? new Date().toISOString() : null
        }]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const updatedTask = successfulRecords[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c,
            description: updatedTask.description_c,
            dueDate: updatedTask.due_date_c,
            priority: updatedTask.priority_c,
            completed: updatedTask.completed_c === "true",
            completedAt: updatedTask.completed_at_c,
            category: updatedTask.category_c,
            farmId: updatedTask.farm_id_c,
            cropId: updatedTask.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to toggle task completion");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling task completion:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
},

  async getOverdueTasks() {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const currentDate = new Date().toISOString();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              operator: "AND", 
              conditions: [
                {
                  fieldName: "completed_c",
                  operator: "NotEqualTo",
                  values: ["true"]
                }
              ]
            },
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "due_date_c",
                  operator: "LessThan", 
                  values: [currentDate]
                }
              ]
            }
          ]
        }],
        orderBy: [
          {
            fieldName: "due_date_c",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c === "true",
        completedAt: task.completed_at_c,
        category: task.category_c,
        farmId: task.farm_id_c,
        cropId: task.crop_id_c
      }));
      
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching overdue tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};
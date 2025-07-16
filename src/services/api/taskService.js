import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

// Add delay to simulate API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async getByFarmId(farmId) {
    await delay(250);
    return tasks.filter(t => t.farmId === parseInt(farmId));
  },

  async getByCropId(cropId) {
    await delay(250);
    return tasks.filter(t => t.cropId === parseInt(cropId));
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null,
      dueDate: new Date(taskData.dueDate).toISOString(),
      completed: false,
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      farmId: parseInt(taskData.farmId),
      cropId: taskData.cropId ? parseInt(taskData.cropId) : null,
      dueDate: new Date(taskData.dueDate).toISOString()
    };
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks.splice(index, 1);
    return true;
  },

  async toggleComplete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    tasks[index].completed = !tasks[index].completed;
    tasks[index].completedAt = tasks[index].completed ? new Date().toISOString() : null;
    return { ...tasks[index] };
  }
};
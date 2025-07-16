import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTabs from "@/components/molecules/FilterTabs";
import FormField from "@/components/molecules/FormField";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { reminderService } from "@/services/api/reminderService";
import { useDebounce } from "@/hooks/useDebounce";
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
const [formData, setFormData] = useState({
    title: "",
    description: "",
    farmId: "",
    cropId: "",
    dueDate: "",
    priority: "medium",
    enableReminder: true,
    reminderDays: 1
  });
  const debouncedSearch = useDebounce(searchTerm, 300);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load tasks data");
      toast.error("Failed to load tasks data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = await taskService.create({
        ...formData,
        cropId: formData.cropId || null
      });
      
      // Schedule reminder if enabled
      if (formData.enableReminder) {
        await reminderService.scheduleReminder(newTask.Id, {
          type: 'task_due',
          daysInAdvance: parseInt(formData.reminderDays),
          notificationMethods: ['in-app']
        });
      }
      
      setTasks([...tasks, newTask]);
      setFormData({
        title: "",
        description: "",
        farmId: "",
        cropId: "",
        dueDate: "",
        priority: "medium",
        enableReminder: true,
        reminderDays: 1
      });
      setShowAddForm(false);
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      farmId: task.farmId.toString(),
      cropId: task.cropId ? task.cropId.toString() : "",
      dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
      priority: task.priority,
      enableReminder: true,
      reminderDays: 1
    });
    setShowAddForm(true);
  };

const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await taskService.update(editingTask.Id, {
        ...formData,
        cropId: formData.cropId || null
      });
      
      // Update reminder if enabled
      if (formData.enableReminder) {
        await reminderService.updateReminder(editingTask.Id, {
          type: 'task_due',
          daysInAdvance: parseInt(formData.reminderDays),
          notificationMethods: ['in-app']
        });
      }
      
      setTasks(tasks.map(t => t.Id === editingTask.Id ? updatedTask : t));
      setFormData({
        title: "",
        description: "",
        farmId: "",
        cropId: "",
        dueDate: "",
        priority: "medium",
        enableReminder: true,
        reminderDays: 1
      });
      setShowAddForm(false);
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(tasks.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? "Task marked as complete!" : "Task marked as incomplete!");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      farmId: "",
      cropId: "",
      dueDate: "",
      priority: "medium",
      enableReminder: true,
      reminderDays: 1
    });
    setShowAddForm(false);
    setEditingTask(null);
  };

  // Filter tasks based on search and tab
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    
    switch (activeTab) {
      case "pending":
        return matchesSearch && !task.completed;
      case "completed":
        return matchesSearch && task.completed;
      case "high":
        return matchesSearch && task.priority === "high";
      case "overdue":
        return matchesSearch && !task.completed && new Date(task.dueDate) < new Date();
      default:
        return matchesSearch;
    }
  });

  const tabs = [
    { id: "all", label: "All Tasks" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "high", label: "High Priority" },
    { id: "overdue", label: "Overdue" }
  ];

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your farm activities and schedules</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="sm:w-80"
        />
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Add/Edit Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="space-y-4">
                <FormField
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter task title"
                />
                
                <FormField
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter task description..."
                  rows={3}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Farm"
                    type="select"
                    value={formData.farmId}
                    onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                    required
                  >
                    <option value="">Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                    ))}
                  </FormField>
                  <FormField
                    label="Crop (Optional)"
                    type="select"
                    value={formData.cropId}
                    onChange={(e) => setFormData({...formData, cropId: e.target.value})}
                  >
                    <option value="">Select a crop (optional)</option>
                    {crops
                      .filter(crop => !formData.farmId || crop.farmId === parseInt(formData.farmId))
                      .map(crop => (
                        <option key={crop.Id} value={crop.Id}>{crop.name}</option>
                      ))}
                  </FormField>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                  <FormField
                    label="Priority"
                    type="select"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
</FormField>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Enable Reminder"
                    type="checkbox"
                    checked={formData.enableReminder}
                    onChange={(e) => setFormData({...formData, enableReminder: e.target.checked})}
                    helperText="Receive notifications before task is due"
                  />
                  {formData.enableReminder && (
                    <FormField
                      label="Reminder Days in Advance"
                      type="select"
                      value={formData.reminderDays}
                      onChange={(e) => setFormData({...formData, reminderDays: e.target.value})}
                    >
                      <option value="1">1 day before</option>
                      <option value="2">2 days before</option>
                      <option value="3">3 days before</option>
                      <option value="7">1 week before</option>
                    </FormField>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <Button type="submit">
                    {editingTask ? "Update Task" : "Add Task"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          message={searchTerm ? "No tasks match your search criteria." : "Get started by adding your first task."}
          icon="CheckSquare"
          actionLabel="Add Task"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid-responsive">
          {filteredTasks.map((task) => {
            const farm = farms.find(f => f.Id === task.farmId);
            const crop = crops.find(c => c.Id === task.cropId);
            return (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard
                  task={task}
                  farm={farm}
                  crop={crop}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onComplete={handleCompleteTask}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tasks;
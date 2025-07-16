import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TaskCard from "@/components/organisms/TaskCard";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import TransactionCard from "@/components/organisms/TransactionCard";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Farms from "@/components/pages/Farms";
import StatCard from "@/components/molecules/StatCard";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { taskService } from "@/services/api/taskService";
import { weatherService } from "@/services/api/weatherService";
import { transactionService } from "@/services/api/transactionService";

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddType, setQuickAddType] = useState("farm");
  const [quickAddLoading, setQuickAddLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farmsData, cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getWeatherData()
      ]);
      
      setFarms(farmsData);
      setCrops(cropsData);
      setTasks(tasksData);
      setTransactions(transactionsData);
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? "Task marked as complete!" : "Task marked as incomplete!");
    } catch (err) {
      toast.error("Failed to update task");
    }
};

  const handleQuickAdd = () => {
    setShowQuickAddModal(true);
  };

  const handleQuickAddSubmit = async (formData) => {
    try {
      setQuickAddLoading(true);
      let newItem;
      
      switch (quickAddType) {
        case "farm":
          newItem = await farmService.create(formData);
          setFarms(prev => [...prev, newItem]);
          toast.success("Farm created successfully!");
          break;
        case "crop":
          newItem = await cropService.create(formData);
          setCrops(prev => [...prev, newItem]);
          toast.success("Crop created successfully!");
          break;
        case "task":
          newItem = await taskService.create(formData);
          setTasks(prev => [...prev, newItem]);
          toast.success("Task created successfully!");
          break;
        case "transaction":
          newItem = await transactionService.create(formData);
          setTransactions(prev => [...prev, newItem]);
          toast.success("Transaction created successfully!");
          break;
      }
      
      setShowQuickAddModal(false);
      // Refresh dashboard data to ensure consistency
      await loadDashboardData();
    } catch (err) {
      toast.error(`Failed to create ${quickAddType}`);
    } finally {
      setQuickAddLoading(false);
    }
};

  const handleExportReport = async () => {
    try {
      setExportLoading(true);
      
      // Calculate statistics for the report
      const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const activeCrops = crops.filter(c => c.status !== "harvested").length;
      const pendingTasks = tasks.filter(t => !t.completed).length;
      const completedTasks = tasks.filter(t => t.completed).length;
      
      // Generate CSV content
      const csvContent = [
        // Header
        'Farm Dashboard Report',
        `Generated: ${new Date().toLocaleString()}`,
        '',
        // Summary Statistics
        'SUMMARY STATISTICS',
        `Total Farms,${farms.length}`,
        `Active Crops,${activeCrops}`,
        `Pending Tasks,${pendingTasks}`,
        `Completed Tasks,${completedTasks}`,
        `Total Income,$${totalIncome.toLocaleString()}`,
        `Total Expenses,$${totalExpenses.toLocaleString()}`,
        `Net Profit,$${(totalIncome - totalExpenses).toLocaleString()}`,
        '',
        // Farms Details
        'FARMS',
        'Name,Location,Size (acres),Type,Status',
        ...farms.map(farm => `${farm.name},${farm.location},${farm.size},${farm.type},Active`),
        '',
        // Crops Details
        'CROPS',
        'Name,Variety,Status,Planting Date,Expected Harvest',
        ...crops.map(crop => `${crop.name},${crop.variety},${crop.status},${crop.plantingDate},${crop.expectedHarvestDate}`),
        '',
        // Recent Tasks
        'TASKS',
        'Title,Priority,Status,Due Date,Farm',
        ...tasks.map(task => {
          const farm = farms.find(f => f.Id === task.farmId);
          return `${task.title},${task.priority},${task.completed ? 'Completed' : 'Pending'},${task.dueDate},${farm?.name || 'Unknown'}`;
        }),
        '',
        // Recent Transactions
        'TRANSACTIONS',
        'Type,Amount,Description,Date,Category',
        ...transactions.map(transaction => `${transaction.type},$${transaction.amount},${transaction.description},${transaction.date},${transaction.category}`)
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `farm-dashboard-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export report. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const renderQuickAddForm = () => {
    switch (quickAddType) {
      case "farm":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              name: e.target.name.value,
              location: e.target.location.value,
              size: parseFloat(e.target.size.value),
              type: e.target.type.value,
              description: e.target.description.value
            };
            handleQuickAddSubmit(formData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter farm name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (acres)</label>
                <input
                  type="number"
                  name="size"
                  required
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter size"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="vegetable">Vegetable</option>
                  <option value="grain">Grain</option>
                  <option value="fruit">Fruit</option>
                  <option value="livestock">Livestock</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuickAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={quickAddLoading}>
                {quickAddLoading ? "Creating..." : "Create Farm"}
              </Button>
            </div>
          </form>
        );
      
      case "crop":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              name: e.target.name.value,
              variety: e.target.variety.value,
              farmId: parseInt(e.target.farmId.value),
              plantingDate: e.target.plantingDate.value,
              expectedHarvestDate: e.target.expectedHarvestDate.value,
              area: parseFloat(e.target.area.value),
              notes: e.target.notes.value
            };
            handleQuickAddSubmit(formData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter crop name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
                <input
                  type="text"
                  name="variety"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter variety"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm</label>
                <select
                  name="farmId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="">Select a farm</option>
                  {farms.map(farm => (
                    <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
                <input
                  type="date"
                  name="plantingDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Harvest Date</label>
                <input
                  type="date"
                  name="expectedHarvestDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (acres)</label>
                <input
                  type="number"
                  name="area"
                  required
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter notes"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuickAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={quickAddLoading}>
                {quickAddLoading ? "Creating..." : "Create Crop"}
              </Button>
            </div>
          </form>
        );
      
      case "task":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              title: e.target.title.value,
              description: e.target.description.value,
              farmId: parseInt(e.target.farmId.value),
              cropId: e.target.cropId.value ? parseInt(e.target.cropId.value) : null,
              priority: e.target.priority.value,
              dueDate: e.target.dueDate.value,
              category: e.target.category.value
            };
            handleQuickAddSubmit(formData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm</label>
                <select
                  name="farmId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="">Select a farm</option>
                  {farms.map(farm => (
                    <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop (Optional)</label>
                <select
                  name="cropId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="">Select a crop</option>
                  {crops.map(crop => (
                    <option key={crop.Id} value={crop.Id}>{crop.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="planting">Planting</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="pest-control">Pest Control</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuickAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={quickAddLoading}>
                {quickAddLoading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        );
      
      case "transaction":
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              type: e.target.type.value,
              amount: parseFloat(e.target.amount.value),
              description: e.target.description.value,
              farmId: parseInt(e.target.farmId.value),
              cropId: e.target.cropId.value ? parseInt(e.target.cropId.value) : null,
              date: e.target.date.value,
              category: e.target.category.value
            };
            handleQuickAddSubmit(formData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm</label>
                <select
                  name="farmId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="">Select a farm</option>
                  {farms.map(farm => (
                    <option key={farm.Id} value={farm.Id}>{farm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop (Optional)</label>
                <select
                  name="cropId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="">Select a crop</option>
                  {crops.map(crop => (
                    <option key={crop.Id} value={crop.Id}>{crop.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="seeds">Seeds</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="equipment">Equipment</option>
                  <option value="labor">Labor</option>
                  <option value="fuel">Fuel</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="sales">Sales</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuickAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={quickAddLoading}>
                {quickAddLoading ? "Creating..." : "Create Transaction"}
              </Button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Loading type="cards" count={3} />
          <Loading type="cards" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const activeCrops = crops.filter(c => c.status !== "harvested").length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const todayTasks = tasks.filter(t => isToday(new Date(t.dueDate)) && !t.completed);
  const upcomingTasks = tasks.filter(t => isTomorrow(new Date(t.dueDate)) && !t.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farm Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening on your farms.</p>
        </div>
<div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportReport}
            disabled={exportLoading}
          >
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            {exportLoading ? 'Exporting...' : 'Export Report'}
          </Button>
          <Button size="sm" onClick={handleQuickAdd}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          change={8.2}
          icon="TrendingUp"
          color="green"
          gradient
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          change={-2.4}
          icon="TrendingDown"
          color="red"
          gradient
        />
        <StatCard
          title="Active Crops"
          value={activeCrops}
          change={12.5}
          icon="Sprout"
          color="forest"
          gradient
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          change={-5.3}
          icon="CheckSquare"
          color="orange"
          gradient
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Tasks and Activities */}
        <div className="xl:col-span-2 space-y-6">
          {/* Today's Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
              <Badge variant="info">{todayTasks.length} tasks</Badge>
            </div>
            
            {todayTasks.length === 0 ? (
              <Empty
                title="No tasks for today"
                message="Great! You're all caught up for today."
                icon="CheckCircle"
                actionLabel="View All Tasks"
                onAction={() => window.location.href = "/tasks"}
              />
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {todayTasks.map((task) => {
                  const farm = farms.find(f => f.Id === task.farmId);
                  const crop = crops.find(c => c.Id === task.cropId);
                  return (
                    <TaskCard
                      key={task.Id}
                      task={task}
                      farm={farm}
                      crop={crop}
                      onComplete={handleCompleteTask}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            {transactions.length === 0 ? (
              <Empty
                title="No transactions yet"
                message="Start tracking your farm income and expenses."
                icon="DollarSign"
                actionLabel="Add Transaction"
                onAction={() => window.location.href = "/finance"}
              />
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.slice(0, 5).map((transaction) => {
                  const farm = farms.find(f => f.Id === transaction.farmId);
                  const crop = crops.find(c => c.Id === transaction.cropId);
                  return (
                    <TransactionCard
                      key={transaction.Id}
                      transaction={transaction}
                      farm={farm}
                      crop={crop}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Weather and Quick Stats */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <WeatherWidget weather={weather} />

          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" className="h-5 w-5 text-forest-600" />
                  <span className="text-sm text-gray-600">Total Farms</span>
                </div>
                <span className="font-semibold text-gray-900">{farms.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Wheat" className="h-5 w-5 text-orange-600" />
                  <span className="text-sm text-gray-600">Ready to Harvest</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {crops.filter(c => c.status === "ready").length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Due Tomorrow</span>
                </div>
                <span className="font-semibold text-gray-900">{upcomingTasks.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="DollarSign" className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Net Profit</span>
                </div>
                <span className="font-semibold text-green-600">
                  ${(totalIncome - totalExpenses).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Farm Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Status</h3>
            <div className="space-y-3">
              {farms.slice(0, 5).map((farm) => (
                <div key={farm.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{farm.name}</p>
                    <p className="text-sm text-gray-600">{farm.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {farm.activeCrops || 0} crops
                    </p>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
</div>
      </div>
      
      {/* Quick Add Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Quick Add</h2>
                <button
                  onClick={() => setShowQuickAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="h-6 w-6" />
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setQuickAddType("farm")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    quickAddType === "farm"
                      ? "bg-white text-forest-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="MapPin" className="h-4 w-4 mr-1 inline" />
                  Farm
                </button>
                <button
                  onClick={() => setQuickAddType("crop")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    quickAddType === "crop"
                      ? "bg-white text-forest-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="Sprout" className="h-4 w-4 mr-1 inline" />
                  Crop
                </button>
                <button
                  onClick={() => setQuickAddType("task")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    quickAddType === "task"
                      ? "bg-white text-forest-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="CheckSquare" className="h-4 w-4 mr-1 inline" />
                  Task
                </button>
                <button
                  onClick={() => setQuickAddType("transaction")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    quickAddType === "transaction"
                      ? "bg-white text-forest-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ApperIcon name="DollarSign" className="h-4 w-4 mr-1 inline" />
                  Money
                </button>
              </div>
              
              {/* Form Content */}
              {renderQuickAddForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
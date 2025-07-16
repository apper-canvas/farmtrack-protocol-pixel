import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow } from "date-fns";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import TaskCard from "@/components/organisms/TaskCard";
import TransactionCard from "@/components/organisms/TransactionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { transactionService } from "@/services/api/transactionService";
import { weatherService } from "@/services/api/weatherService";

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
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
    </div>
  );
};

export default Dashboard;
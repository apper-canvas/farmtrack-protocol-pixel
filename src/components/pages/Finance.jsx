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
import StatCard from "@/components/molecules/StatCard";
import TransactionCard from "@/components/organisms/TransactionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { useDebounce } from "@/hooks/useDebounce";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    farmId: "",
    cropId: ""
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, farmsData, cropsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);
      setTransactions(transactionsData);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load financial data");
      toast.error("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = await transactionService.create({
        ...formData,
        amount: parseFloat(formData.amount),
        farmId: formData.farmId || null,
        cropId: formData.cropId || null
      });
      setTransactions([...transactions, newTransaction]);
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
        farmId: "",
        cropId: ""
      });
      setShowAddForm(false);
      toast.success("Transaction added successfully!");
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description || "",
      date: format(new Date(transaction.date), "yyyy-MM-dd"),
      farmId: transaction.farmId ? transaction.farmId.toString() : "",
      cropId: transaction.cropId ? transaction.cropId.toString() : ""
    });
    setShowAddForm(true);
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      const updatedTransaction = await transactionService.update(editingTransaction.Id, {
        ...formData,
        amount: parseFloat(formData.amount),
        farmId: formData.farmId || null,
        cropId: formData.cropId || null
      });
      setTransactions(transactions.map(t => t.Id === editingTransaction.Id ? updatedTransaction : t));
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
        farmId: "",
        cropId: ""
      });
      setShowAddForm(false);
      setEditingTransaction(null);
      toast.success("Transaction updated successfully!");
    } catch (err) {
      toast.error("Failed to update transaction");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(transactionId);
        setTransactions(transactions.filter(t => t.Id !== transactionId));
        toast.success("Transaction deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      farmId: "",
      cropId: ""
    });
    setShowAddForm(false);
    setEditingTransaction(null);
  };

  // Filter transactions based on search and tab
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         (transaction.description && transaction.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
    
    switch (activeTab) {
      case "income":
        return matchesSearch && transaction.type === "income";
      case "expense":
        return matchesSearch && transaction.type === "expense";
      case "recent":
        return matchesSearch; // Show all, sorted by date
      default:
        return matchesSearch;
    }
  });

  const tabs = [
    { id: "all", label: "All Transactions" },
    { id: "income", label: "Income" },
    { id: "expense", label: "Expenses" },
    { id: "recent", label: "Recent" }
  ];

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;

  const expenseCategories = ["seeds", "fertilizer", "equipment", "fuel", "labor", "other"];
  const incomeCategories = ["sale", "subsidy", "other"];

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="stats" />
        <Loading type="cards" count={6} />
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600 mt-1">Track your farm income and expenses</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          color="green"
          gradient
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="red"
          gradient
        />
        <StatCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString()}`}
          icon="DollarSign"
          color={netProfit >= 0 ? "green" : "red"}
          gradient
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search transactions..."
          className="sm:w-80"
        />
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Add/Edit Transaction Form */}
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
                  {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Transaction Type"
                    type="select"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </FormField>
                  <FormField
                    label="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Category"
                    type="select"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    {(formData.type === "expense" ? expenseCategories : incomeCategories).map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </FormField>
                  <FormField
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <FormField
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description..."
                  rows={3}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Farm (Optional)"
                    type="select"
                    value={formData.farmId}
                    onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                  >
                    <option value="">Select farm (optional)</option>
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
                    <option value="">Select crop (optional)</option>
                    {crops
                      .filter(crop => !formData.farmId || crop.farmId === parseInt(formData.farmId))
                      .map(crop => (
                        <option key={crop.Id} value={crop.Id}>{crop.name}</option>
                      ))}
                  </FormField>
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <Button type="submit">
                    {editingTransaction ? "Update Transaction" : "Add Transaction"}
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

      {/* Transactions Grid */}
      {filteredTransactions.length === 0 ? (
        <Empty
          title="No transactions found"
          message={searchTerm ? "No transactions match your search criteria." : "Get started by adding your first transaction."}
          icon="DollarSign"
          actionLabel="Add Transaction"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid-responsive">
          {filteredTransactions.map((transaction) => {
            const farm = farms.find(f => f.Id === transaction.farmId);
            const crop = crops.find(c => c.Id === transaction.cropId);
            return (
              <motion.div
                key={transaction.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TransactionCard
                  transaction={transaction}
                  farm={farm}
                  crop={crop}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Finance;
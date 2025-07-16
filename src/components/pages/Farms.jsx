import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTabs from "@/components/molecules/FilterTabs";
import FormField from "@/components/molecules/FormField";
import FarmCard from "@/components/organisms/FarmCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { farmService } from "@/services/api/farmService";
import { useDebounce } from "@/hooks/useDebounce";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    sizeUnit: "acres"
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError("Failed to load farms");
      toast.error("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleAddFarm = async (e) => {
    e.preventDefault();
    try {
      const newFarm = await farmService.create({
        ...formData,
        size: parseFloat(formData.size)
      });
      setFarms([...farms, newFarm]);
      setFormData({ name: "", location: "", size: "", sizeUnit: "acres" });
      setShowAddForm(false);
      toast.success("Farm added successfully!");
    } catch (err) {
      toast.error("Failed to add farm");
    }
  };

  const handleEditFarm = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit
    });
    setShowAddForm(true);
  };

  const handleUpdateFarm = async (e) => {
    e.preventDefault();
    try {
      const updatedFarm = await farmService.update(editingFarm.Id, {
        ...formData,
        size: parseFloat(formData.size)
      });
      setFarms(farms.map(f => f.Id === editingFarm.Id ? updatedFarm : f));
      setFormData({ name: "", location: "", size: "", sizeUnit: "acres" });
      setShowAddForm(false);
      setEditingFarm(null);
      toast.success("Farm updated successfully!");
    } catch (err) {
      toast.error("Failed to update farm");
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        await farmService.delete(farmId);
        setFarms(farms.filter(f => f.Id !== farmId));
        toast.success("Farm deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const handleViewDetails = (farm) => {
    // Navigate to farm details or open modal
    toast.info(`Viewing details for ${farm.name}`);
  };

  const handleCancel = () => {
    setFormData({ name: "", location: "", size: "", sizeUnit: "acres" });
    setShowAddForm(false);
    setEditingFarm(null);
  };

  // Filter farms based on search and tab
  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         farm.location.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    switch (activeTab) {
      case "large":
        return matchesSearch && farm.size > 100;
      case "medium":
        return matchesSearch && farm.size >= 50 && farm.size <= 100;
      case "small":
        return matchesSearch && farm.size < 50;
      default:
        return matchesSearch;
    }
  });

  const tabs = [
    { id: "all", label: "All Farms" },
    { id: "large", label: "Large (>100 acres)" },
    { id: "medium", label: "Medium (50-100 acres)" },
    { id: "small", label: "Small (<50 acres)" }
  ];

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadFarms} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-1">Manage your farm properties and locations</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Farm</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search farms..."
          className="sm:w-80"
        />
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Add/Edit Farm Form */}
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
                  {editingFarm ? "Edit Farm" : "Add New Farm"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={editingFarm ? handleUpdateFarm : handleAddFarm} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Farm Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Enter farm name"
                  />
                  <FormField
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    placeholder="Enter location"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Size"
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    required
                    placeholder="Enter size"
                    min="0"
                    step="0.1"
                  />
                  <FormField
                    label="Size Unit"
                    type="select"
                    value={formData.sizeUnit}
                    onChange={(e) => setFormData({...formData, sizeUnit: e.target.value})}
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                    <option value="sq ft">Square Feet</option>
                    <option value="sq m">Square Meters</option>
                  </FormField>
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <Button type="submit">
                    {editingFarm ? "Update Farm" : "Add Farm"}
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

      {/* Farms Grid */}
      {filteredFarms.length === 0 ? (
        <Empty
          title="No farms found"
          message={searchTerm ? "No farms match your search criteria." : "Get started by adding your first farm."}
          icon="MapPin"
          actionLabel="Add Farm"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid-responsive">
          {filteredFarms.map((farm) => (
            <motion.div
              key={farm.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FarmCard
                farm={farm}
                onEdit={handleEditFarm}
                onDelete={handleDeleteFarm}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farms;
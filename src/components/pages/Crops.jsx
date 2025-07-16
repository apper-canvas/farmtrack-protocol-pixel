import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import FilterTabs from "@/components/molecules/FilterTabs";
import FormField from "@/components/molecules/FormField";
import CropCard from "@/components/organisms/CropCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { useDebounce } from "@/hooks/useDebounce";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    farmId: "",
    plantingDate: "",
    expectedHarvestDate: "",
    area: "",
    notes: ""
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops data");
      toast.error("Failed to load crops data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      const newCrop = await cropService.create({
        ...formData,
        area: parseFloat(formData.area)
      });
      setCrops([...crops, newCrop]);
      setFormData({
        name: "",
        variety: "",
        farmId: "",
        plantingDate: "",
        expectedHarvestDate: "",
        area: "",
        notes: ""
      });
      setShowAddForm(false);
      toast.success("Crop added successfully!");
    } catch (err) {
      toast.error("Failed to add crop");
    }
  };

  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name,
      variety: crop.variety,
      farmId: crop.farmId.toString(),
      plantingDate: format(new Date(crop.plantingDate), "yyyy-MM-dd"),
      expectedHarvestDate: format(new Date(crop.expectedHarvestDate), "yyyy-MM-dd"),
      area: crop.area.toString(),
      notes: crop.notes || ""
    });
    setShowAddForm(true);
  };

  const handleUpdateCrop = async (e) => {
    e.preventDefault();
    try {
      const updatedCrop = await cropService.update(editingCrop.Id, {
        ...formData,
        area: parseFloat(formData.area)
      });
      setCrops(crops.map(c => c.Id === editingCrop.Id ? updatedCrop : c));
      setFormData({
        name: "",
        variety: "",
        farmId: "",
        plantingDate: "",
        expectedHarvestDate: "",
        area: "",
        notes: ""
      });
      setShowAddForm(false);
      setEditingCrop(null);
      toast.success("Crop updated successfully!");
    } catch (err) {
      toast.error("Failed to update crop");
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(cropId);
        setCrops(crops.filter(c => c.Id !== cropId));
        toast.success("Crop deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete crop");
      }
    }
  };

  const handleHarvestCrop = async (cropId) => {
    try {
      const updatedCrop = await cropService.updateStatus(cropId, "harvested");
      setCrops(crops.map(c => c.Id === cropId ? updatedCrop : c));
      toast.success("Crop marked as harvested!");
    } catch (err) {
      toast.error("Failed to update crop status");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      variety: "",
      farmId: "",
      plantingDate: "",
      expectedHarvestDate: "",
      area: "",
      notes: ""
    });
    setShowAddForm(false);
    setEditingCrop(null);
  };

  // Filter crops based on search and tab
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    switch (activeTab) {
      case "seedling":
        return matchesSearch && crop.status === "seedling";
      case "growing":
        return matchesSearch && crop.status === "growing";
      case "ready":
        return matchesSearch && crop.status === "ready";
      case "harvested":
        return matchesSearch && crop.status === "harvested";
      default:
        return matchesSearch;
    }
  });

  const tabs = [
    { id: "all", label: "All Crops" },
    { id: "seedling", label: "Seedling" },
    { id: "growing", label: "Growing" },
    { id: "ready", label: "Ready" },
    { id: "harvested", label: "Harvested" }
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
          <h1 className="text-2xl font-bold text-gray-900">Crops</h1>
          <p className="text-gray-600 mt-1">Track your crop planting and harvest cycles</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>Add Crop</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search crops..."
          className="sm:w-80"
        />
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

{/* Add/Edit Crop Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={handleCancel}
        title={editingCrop ? "Edit Crop" : "Add New Crop"}
        size="lg"
      >
        <form onSubmit={editingCrop ? handleUpdateCrop : handleAddCrop} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Crop Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter crop name"
            />
            <FormField
              label="Variety"
              value={formData.variety}
              onChange={(e) => setFormData({...formData, variety: e.target.value})}
              required
              placeholder="Enter variety"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="Planting Date"
              type="date"
              value={formData.plantingDate}
              onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
              required
            />
            <FormField
              label="Expected Harvest Date"
              type="date"
              value={formData.expectedHarvestDate}
              onChange={(e) => setFormData({...formData, expectedHarvestDate: e.target.value})}
              required
            />
          </div>
          
          <FormField
            label="Area (acres)"
            type="number"
            value={formData.area}
            onChange={(e) => setFormData({...formData, area: e.target.value})}
            required
            placeholder="Enter area"
            min="0"
            step="0.1"
          />
          
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Additional notes about this crop..."
            rows={3}
          />
          
          <div className="flex items-center space-x-4 pt-4">
            <Button type="submit">
              {editingCrop ? "Update Crop" : "Add Crop"}
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
      </Modal>

      {/* Crops Grid */}
      {filteredCrops.length === 0 ? (
        <Empty
          title="No crops found"
          message={searchTerm ? "No crops match your search criteria." : "Get started by adding your first crop."}
          icon="Sprout"
          actionLabel="Add Crop"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid-responsive">
          {filteredCrops.map((crop) => {
            const farm = farms.find(f => f.Id === crop.farmId);
            return (
              <motion.div
                key={crop.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CropCard
                  crop={crop}
                  farm={farm}
                  onEdit={handleEditCrop}
                  onDelete={handleDeleteCrop}
                  onHarvest={handleHarvestCrop}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Crops;
import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

// Add delay to simulate API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cropService = {
  async getAll() {
    await delay(300);
    return [...crops];
  },

  async getById(id) {
    await delay(200);
    const crop = crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    return { ...crop };
  },

  async getByFarmId(farmId) {
    await delay(250);
    return crops.filter(c => c.farmId === parseInt(farmId));
  },

  async create(cropData) {
    await delay(400);
    const newCrop = {
      ...cropData,
      Id: Math.max(...crops.map(c => c.Id)) + 1,
      farmId: parseInt(cropData.farmId),
      plantingDate: new Date(cropData.plantingDate).toISOString(),
      expectedHarvestDate: new Date(cropData.expectedHarvestDate).toISOString(),
      status: "seedling"
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  async update(id, cropData) {
    await delay(350);
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    const updatedCrop = {
      ...crops[index],
      ...cropData,
      farmId: parseInt(cropData.farmId),
      plantingDate: new Date(cropData.plantingDate).toISOString(),
      expectedHarvestDate: new Date(cropData.expectedHarvestDate).toISOString()
    };
    crops[index] = updatedCrop;
    return { ...updatedCrop };
  },

  async delete(id) {
    await delay(250);
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    crops.splice(index, 1);
    return true;
  },

  async updateStatus(id, status) {
    await delay(200);
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    crops[index].status = status;
    return { ...crops[index] };
  }
};
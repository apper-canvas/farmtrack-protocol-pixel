const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const farmService = {
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
          { field: { Name: "location_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "active_crops_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('farm_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.Name,
        location: farm.location_c,
        size: farm.size_c,
        sizeUnit: farm.size_unit_c,
        activeCrops: farm.active_crops_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching farms:", error?.response?.data?.message);
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
          { field: { Name: "location_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "active_crops_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('farm_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        location: response.data.location_c,
        size: response.data.size_c,
        sizeUnit: response.data.size_unit_c,
        activeCrops: response.data.active_crops_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching farm with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(farmData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: farmData.name,
          location_c: farmData.location,
          size_c: farmData.size,
          size_unit_c: farmData.sizeUnit,
          active_crops_c: 0
        }]
      };
      
      const response = await apperClient.createRecord('farm_c', params);
      
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
          const farm = successfulRecords[0].data;
          return {
            Id: farm.Id,
            name: farm.Name,
            location: farm.location_c,
            size: farm.size_c,
            sizeUnit: farm.size_unit_c,
            activeCrops: farm.active_crops_c || 0
          };
        }
      }
      
      throw new Error("Failed to create farm");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating farm:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, farmData) {
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
          Name: farmData.name,
          location_c: farmData.location,
          size_c: farmData.size,
          size_unit_c: farmData.sizeUnit
        }]
      };
      
      const response = await apperClient.updateRecord('farm_c', params);
      
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
          const farm = successfulRecords[0].data;
          return {
            Id: farm.Id,
            name: farm.Name,
            location: farm.location_c,
            size: farm.size_c,
            sizeUnit: farm.size_unit_c,
            activeCrops: farm.active_crops_c || 0
          };
        }
      }
      
      throw new Error("Failed to update farm");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating farm:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('farm_c', params);
      
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
        console.error("Error deleting farm:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};
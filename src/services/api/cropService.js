const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const cropService = {
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
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "area_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('crop_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(crop => ({
        Id: crop.Id,
        name: crop.Name,
        variety: crop.variety_c,
        plantingDate: crop.planting_date_c,
        expectedHarvestDate: crop.expected_harvest_date_c,
        status: crop.status_c,
        area: crop.area_c,
        notes: crop.notes_c,
        farmId: crop.farm_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
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
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "area_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('crop_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return {
        Id: response.data.Id,
        name: response.data.Name,
        variety: response.data.variety_c,
        plantingDate: response.data.planting_date_c,
        expectedHarvestDate: response.data.expected_harvest_date_c,
        status: response.data.status_c,
        area: response.data.area_c,
        notes: response.data.notes_c,
        farmId: response.data.farm_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching crop with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(cropData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: cropData.name,
          variety_c: cropData.variety,
          planting_date_c: cropData.plantingDate,
          expected_harvest_date_c: cropData.expectedHarvestDate,
          status_c: "seedling",
          area_c: cropData.area,
          notes_c: cropData.notes,
          farm_id_c: parseInt(cropData.farmId)
        }]
      };
      
      const response = await apperClient.createRecord('crop_c', params);
      
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
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            name: crop.Name,
            variety: crop.variety_c,
            plantingDate: crop.planting_date_c,
            expectedHarvestDate: crop.expected_harvest_date_c,
            status: crop.status_c,
            area: crop.area_c,
            notes: crop.notes_c,
            farmId: crop.farm_id_c
          };
        }
      }
      
      throw new Error("Failed to create crop");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, cropData) {
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
          Name: cropData.name,
          variety_c: cropData.variety,
          planting_date_c: cropData.plantingDate,
          expected_harvest_date_c: cropData.expectedHarvestDate,
          area_c: cropData.area,
          notes_c: cropData.notes,
          farm_id_c: parseInt(cropData.farmId)
        }]
      };
      
      const response = await apperClient.updateRecord('crop_c', params);
      
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
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            name: crop.Name,
            variety: crop.variety_c,
            plantingDate: crop.planting_date_c,
            expectedHarvestDate: crop.expected_harvest_date_c,
            status: crop.status_c,
            area: crop.area_c,
            notes: crop.notes_c,
            farmId: crop.farm_id_c
          };
        }
      }
      
      throw new Error("Failed to update crop");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('crop_c', params);
      
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
        console.error("Error deleting crop:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async updateStatus(id, status) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };
      
      const response = await apperClient.updateRecord('crop_c', params);
      
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
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            name: crop.Name,
            variety: crop.variety_c,
            plantingDate: crop.planting_date_c,
            expectedHarvestDate: crop.expected_harvest_date_c,
            status: crop.status_c,
            area: crop.area_c,
            notes: crop.notes_c,
            farmId: crop.farm_id_c
          };
        }
      }
      
      throw new Error("Failed to update crop status");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};
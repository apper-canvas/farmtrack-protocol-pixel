const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
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
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('transaction_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c,
        amount: transaction.amount_c,
        category: transaction.category_c,
        description: transaction.description_c,
        date: transaction.date_c,
        farmId: transaction.farm_id_c,
        cropId: transaction.crop_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
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
          { field: { Name: "type_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('transaction_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return {
        Id: response.data.Id,
        type: response.data.type_c,
        amount: response.data.amount_c,
        category: response.data.category_c,
        description: response.data.description_c,
        date: response.data.date_c,
        farmId: response.data.farm_id_c,
        cropId: response.data.crop_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(transactionData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: transactionData.description,
          type_c: transactionData.type,
          amount_c: transactionData.amount,
          category_c: transactionData.category,
          description_c: transactionData.description,
          date_c: transactionData.date,
          farm_id_c: transactionData.farmId ? parseInt(transactionData.farmId) : null,
          crop_id_c: transactionData.cropId ? parseInt(transactionData.cropId) : null
        }]
      };
      
      const response = await apperClient.createRecord('transaction_c', params);
      
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
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c,
            amount: transaction.amount_c,
            category: transaction.category_c,
            description: transaction.description_c,
            date: transaction.date_c,
            farmId: transaction.farm_id_c,
            cropId: transaction.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to create transaction");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, transactionData) {
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
          Name: transactionData.description,
          type_c: transactionData.type,
          amount_c: transactionData.amount,
          category_c: transactionData.category,
          description_c: transactionData.description,
          date_c: transactionData.date,
          farm_id_c: transactionData.farmId ? parseInt(transactionData.farmId) : null,
          crop_id_c: transactionData.cropId ? parseInt(transactionData.cropId) : null
        }]
      };
      
      const response = await apperClient.updateRecord('transaction_c', params);
      
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
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c,
            amount: transaction.amount_c,
            category: transaction.category_c,
            description: transaction.description_c,
            date: transaction.date_c,
            farmId: transaction.farm_id_c,
            cropId: transaction.crop_id_c
          };
        }
      }
      
      throw new Error("Failed to update transaction");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
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
      
      const response = await apperClient.deleteRecord('transaction_c', params);
      
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
        console.error("Error deleting transaction:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};
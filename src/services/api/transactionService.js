import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

// Add delay to simulate API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getAll() {
    await delay(300);
    return [...transactions];
  },

  async getById(id) {
    await delay(200);
    const transaction = transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return { ...transaction };
  },

  async getByFarmId(farmId) {
    await delay(250);
    return transactions.filter(t => t.farmId === parseInt(farmId));
  },

  async getByCropId(cropId) {
    await delay(250);
    return transactions.filter(t => t.cropId === parseInt(cropId));
  },

  async create(transactionData) {
    await delay(400);
    const newTransaction = {
      ...transactionData,
      Id: Math.max(...transactions.map(t => t.Id)) + 1,
      farmId: parseInt(transactionData.farmId),
      cropId: transactionData.cropId ? parseInt(transactionData.cropId) : null,
      date: new Date(transactionData.date).toISOString(),
      amount: parseFloat(transactionData.amount)
    };
    transactions.push(newTransaction);
    return { ...newTransaction };
  },

  async update(id, transactionData) {
    await delay(350);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    const updatedTransaction = {
      ...transactions[index],
      ...transactionData,
      farmId: parseInt(transactionData.farmId),
      cropId: transactionData.cropId ? parseInt(transactionData.cropId) : null,
      date: new Date(transactionData.date).toISOString(),
      amount: parseFloat(transactionData.amount)
    };
    transactions[index] = updatedTransaction;
    return { ...updatedTransaction };
  },

  async delete(id) {
    await delay(250);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    transactions.splice(index, 1);
    return true;
  }
};
// Add delay to simulate API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Weather service with structured data - ready for real API integration
export const weatherService = {
  async getCurrent() {
    await delay(200);
    return {
      location: "Central Valley, CA",
      temperature: 78,
      condition: "sunny",
      humidity: 45,
      windSpeed: 12,
      precipitation: 0,
      lastUpdated: new Date().toISOString()
    };
  },

  async getForecast() {
    await delay(300);
    const today = new Date();
    const forecast = [];
    
    for (let i = 1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      forecast.push({
        date: date.toISOString(),
        condition: ["sunny", "partly-cloudy", "cloudy", "rainy"][Math.floor(Math.random() * 4)],
        high: 75 + Math.floor(Math.random() * 15),
        low: 50 + Math.floor(Math.random() * 15),
        precipitation: Math.floor(Math.random() * 100),
        windSpeed: 8 + Math.floor(Math.random() * 20)
      });
    }
    
    return forecast;
  },

  async getWeatherData() {
    await delay(250);
    const [current, forecast] = await Promise.all([
      this.getCurrent(),
      this.getForecast()
    ]);
    
    return {
      current,
      forecast
    };
  }
};
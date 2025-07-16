import weatherData from "@/services/mockData/weather.json";

// Add delay to simulate API call
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const weatherService = {
  async getCurrent() {
    await delay(200);
    return { ...weatherData.current };
  },

  async getForecast() {
    await delay(300);
    return [...weatherData.forecast];
  },

  async getWeatherData() {
    await delay(250);
    return {
      current: { ...weatherData.current },
      forecast: [...weatherData.forecast]
    };
  }
};
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { weatherService } from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("central-valley");

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getWeatherData();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather data");
      toast.error("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const getWeatherIcon = (condition) => {
    const icons = {
      "sunny": "Sun",
      "cloudy": "Cloud",
      "rainy": "CloudRain",
      "partly-cloudy": "CloudSun",
      "stormy": "CloudLightning",
      "snowy": "CloudSnow",
      "windy": "Wind"
    };
    return icons[condition] || "CloudSun";
  };

  const getWeatherAdvice = (condition, temperature) => {
    const advice = [];
    
    if (condition === "rainy") {
      advice.push("🌧️ Perfect time for indoor tasks like equipment maintenance");
      advice.push("💧 Check drainage systems and water runoff");
      advice.push("🏠 Ensure livestock has adequate shelter");
    } else if (condition === "sunny" && temperature > 85) {
      advice.push("☀️ Early morning work recommended (5-10 AM)");
      advice.push("💦 Increase watering frequency for crops");
      advice.push("🌡️ Monitor heat stress in livestock");
    } else if (condition === "stormy") {
      advice.push("⛈️ Secure loose equipment and materials");
      advice.push("🌊 Check and clear drainage channels");
      advice.push("🏠 Ensure all animals are sheltered");
    } else if (temperature < 40) {
      advice.push("❄️ Protect sensitive crops from frost");
      advice.push("🔥 Check heating systems for livestock");
      advice.push("💧 Prevent water systems from freezing");
    } else {
      advice.push("🌱 Excellent conditions for outdoor farming");
      advice.push("🚜 Good day for field work and maintenance");
      advice.push("🌾 Ideal for crop monitoring and harvesting");
    }
    
    return advice;
  };

  const locations = [
    { id: "central-valley", name: "Central Valley, CA" },
    { id: "napa-valley", name: "Napa Valley, CA" },
    { id: "san-joaquin", name: "San Joaquin Valley, CA" },
    { id: "riverside", name: "Riverside County, CA" },
    { id: "sonoma", name: "Sonoma County, CA" }
  ];

  if (loading) {
    return <Loading type="cards" count={3} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadWeatherData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weather</h1>
          <p className="text-gray-600 mt-1">Monitor weather conditions for better farm planning</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={loadWeatherData}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Main Weather Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="xl:col-span-2">
          <WeatherWidget weather={weather} />
        </div>

        {/* Weather Alerts & Advice */}
        <div className="space-y-6">
          {/* Weather Alerts */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Weather Alerts</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Sun" className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">High Temperature</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Expected high of 85°F today. Consider early morning work.
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CloudRain" className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Rain Expected</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  80% chance of rain Thursday. Perfect for indoor tasks.
                </p>
              </div>
            </div>
          </Card>

          {/* Farming Advice */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <ApperIcon name="Lightbulb" className="h-5 w-5 text-forest-600" />
              <h3 className="text-lg font-semibold text-gray-900">Farming Advice</h3>
            </div>
            <div className="space-y-2">
              {getWeatherAdvice(weather?.current?.condition, weather?.current?.temperature).map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-forest-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Detailed Forecast */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Extended Forecast</h3>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {weather?.forecast?.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg text-center"
            >
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(day.date), "EEEE")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(day.date), "MMM d")}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <ApperIcon 
                    name={getWeatherIcon(day.condition)} 
                    className="h-8 w-8 text-gray-600" 
                  />
                </div>
                
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {day.high}°/{day.low}°
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {day.condition}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <ApperIcon name="CloudRain" className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-gray-600">{day.precipitation}%</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <ApperIcon name="Wind" className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{day.windSpeed} mph</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Agricultural Weather Index */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agricultural Weather Index</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <ApperIcon name="Sprout" className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-semibold text-green-900">Growing Conditions</p>
            <p className="text-2xl font-bold text-green-600">Excellent</p>
            <p className="text-sm text-green-700">Perfect for most crops</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <ApperIcon name="Droplets" className="h-6 w-6 text-blue-600" />
            </div>
            <p className="font-semibold text-blue-900">Irrigation Needs</p>
            <p className="text-2xl font-bold text-blue-600">Moderate</p>
            <p className="text-sm text-blue-700">Normal watering required</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="flex justify-center mb-2">
              <ApperIcon name="Bug" className="h-6 w-6 text-orange-600" />
            </div>
            <p className="font-semibold text-orange-900">Pest Risk</p>
            <p className="text-2xl font-bold text-orange-600">Low</p>
            <p className="text-sm text-orange-700">Minimal pest activity</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Weather;
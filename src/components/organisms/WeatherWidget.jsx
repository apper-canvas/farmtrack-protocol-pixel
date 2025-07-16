import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const WeatherWidget = ({ weather, className }) => {
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
  
  const getWeatherGradient = (condition) => {
    const gradients = {
      "sunny": "from-yellow-400 to-orange-500",
      "cloudy": "from-gray-400 to-gray-600",
      "rainy": "from-blue-400 to-blue-600",
      "partly-cloudy": "from-yellow-400 to-blue-400",
      "stormy": "from-purple-600 to-gray-800",
      "snowy": "from-blue-100 to-blue-300",
      "windy": "from-teal-400 to-blue-500"
    };
    return gradients[condition] || "from-blue-400 to-blue-600";
  };
  
  const getFarmingTip = (condition, temperature) => {
    if (condition === "rainy") return "Good day for indoor tasks";
    if (condition === "sunny" && temperature > 85) return "Consider early morning watering";
    if (condition === "stormy") return "Secure equipment and check drainage";
    if (temperature < 40) return "Protect sensitive crops from cold";
    return "Perfect weather for outdoor farming";
  };
  
  const current = weather?.current || {};
  const forecast = weather?.forecast || [];
  
  return (
    <Card className={cn("", className)} gradient>
      <div className="space-y-6">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Today's Weather</h3>
            <p className="text-sm text-gray-600">{current.location || "Farm Location"}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-3 rounded-full bg-gradient-to-br",
              getWeatherGradient(current.condition)
            )}>
              <ApperIcon 
                name={getWeatherIcon(current.condition)} 
                className="h-8 w-8 text-white weather-icon" 
              />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">{current.temperature || 75}°F</p>
              <p className="text-sm text-gray-600 capitalize">{current.condition || "sunny"}</p>
            </div>
          </div>
        </div>
        
        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <ApperIcon name="Droplets" className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="font-semibold">{current.humidity || 65}%</p>
          </div>
          <div className="text-center">
            <ApperIcon name="Wind" className="h-5 w-5 text-gray-500 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Wind</p>
            <p className="font-semibold">{current.windSpeed || 8} mph</p>
          </div>
          <div className="text-center">
            <ApperIcon name="CloudRain" className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Rain</p>
            <p className="font-semibold">{current.precipitation || 0}%</p>
          </div>
        </div>
        
        {/* Farming Tip */}
        <div className="bg-forest-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Lightbulb" className="h-5 w-5 text-forest-600" />
            <p className="text-sm font-medium text-forest-800">Farming Tip</p>
          </div>
          <p className="text-sm text-forest-700 mt-1">
            {getFarmingTip(current.condition, current.temperature)}
          </p>
        </div>
        
        {/* 5-Day Forecast */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">5-Day Forecast</h4>
          <div className="space-y-2">
            {forecast.slice(0, 5).map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-2 px-3 bg-white rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={getWeatherIcon(day.condition)} 
                    className="h-5 w-5 text-gray-600" 
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(day.date), "EEE")}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {day.high}°/{day.low}°
                  </p>
                  <p className="text-xs text-blue-600">{day.precipitation}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;
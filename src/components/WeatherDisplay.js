import React, { useState } from "react";

const WeatherDisplay = ({
  currentWeather,
  forecast,
  unit,
  toggleUnit,
  addFavorite,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  if (!currentWeather) return <p>No weather data available</p>;

  const unitSymbol = unit === "metric" ? "C" : "F";

  // Function to format date
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Function to get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const handleAddFavorite = async () => {
    setIsAdding(true);
    await addFavorite();
    setIsAdding(false);
  };

  return (
    <div className="weather-display">
      <div className="current-weather">
        <div>
          <div>
            <button onClick={toggleUnit}>
              Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
            </button>

            <button onClick={handleAddFavorite} disabled={isAdding}>
              {isAdding ? "Adding..." : "Add to Favorites"}
            </button>
          </div>
        </div>
        <h2>Current Weather in {currentWeather.name}</h2>
        <p>
          Temperature: {currentWeather.main.temp}°{unitSymbol}
        </p>
        <p>
          Weather: {currentWeather.weather[0].description}
          <img
            src={getWeatherIconUrl(currentWeather.weather[0].icon)}
            alt={currentWeather.weather[0].description}
          />
        </p>
        <p>Humidity: {currentWeather.main.humidity}%</p>
        <p>
          Wind: {currentWeather.wind.speed} {unit === "metric" ? "m/s" : "mph"}
        </p>
      </div>
      <div className="forecast">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-day">
            <p> {formatDate(day.date)}</p>
            <p>
              Temperature: {day.avgTemp}°{unitSymbol}
            </p>
            <p>
              <img
                src={getWeatherIconUrl(day.weather.icon)}
                alt={day.weather.description}
              />
              {day.weather.description}
            </p>
            <p>Humidity: {day.avgHumidity.toFixed(2)}%</p>
            <p>
              Wind: {day.avgWind.toFixed(2)} {unit === "metric" ? "m/s" : "mph"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;

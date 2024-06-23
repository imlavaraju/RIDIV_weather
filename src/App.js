import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import WeatherDisplay from "./components/WeatherDisplay";
import Favorites from "./components/Favourites";
import "./App.css";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [searchedCity, setSearchedCity] = useState("");
  const [view, setView] = useState("dashboard");
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("http://localhost:5000/favorites");
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  const fetchWeatherData = async (city) => {
    setSearchedCity(city);
    try {
      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=75cbbbe302d33d728e1428447c1abe0a`
      );
      const forecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=75cbbbe302d33d728e1428447c1abe0a`
      );
      setCurrentWeather(current.data);
      setForecast(processForecastData(forecast.data.list));
      localStorage.setItem("lastCity", city);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please enter a valid city name.");
    }
  };

  const processForecastData = (forecastData) => {
    const days = {};

    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
      });

      if (!days[date]) {
        days[date] = {
          temp: [],
          humidity: [],
          wind: [],
          weather: [],
        };
      }

      days[date].temp.push(item.main.temp);
      days[date].humidity.push(item.main.humidity);
      days[date].wind.push(item.wind.speed);
      days[date].weather.push(item.weather[0]);
    });

    return Object.keys(days)
      .slice(0, 5)
      .map((date) => {
        const day = days[date];
        const avgTemp = day.temp.reduce((a, b) => a + b, 0) / day.temp.length;
        const avgHumidity =
          day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length;
        const avgWind = day.wind.reduce((a, b) => a + b, 0) / day.wind.length;

        const mostCommonWeather = day.weather
          .sort(
            (a, b) =>
              day.weather.filter((v) => v === a).length -
              day.weather.filter((v) => v === b).length
          )
          .pop();

        return {
          date,
          avgTemp: avgTemp.toFixed(2), // Ensure avgTemp is a fixed-point number
          avgHumidity,
          avgWind,
          weather: mostCommonWeather,
        };
      });
  };

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      fetchWeatherData(lastCity);
    }
  }, [unit]);

  const addFavorite = async () => {
    if (searchedCity.trim() === "") return;
    try {
      const response = await axios.post("http://localhost:5000/favorites", {
        city: searchedCity,
      });
      setFavorites([...favorites, response.data]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/favorites/${id}`);
      setFavorites(favorites.filter((favorite) => favorite.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  return (
    <div className="App">
      <header>
        <nav>
          <div className="left">
            <span>Weather</span>
          </div>
          <div className="right">
            <span className="fav" onMouseEnter={() => setView("favorites")}>
              Favorites
            </span>
            <span className="star" onMouseEnter={() => setView("favorites")}>
              &#9733;
            </span>

            <span onMouseEnter={() => setView("dashboard")}>Dashboard</span>
          </div>
        </nav>
      </header>
      {view === "dashboard" ? (
        <>
          <Search fetchWeatherData={fetchWeatherData} />

          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <WeatherDisplay
              currentWeather={currentWeather}
              forecast={forecast}
              unit={unit}
              toggleUnit={toggleUnit}
              addFavorite={addFavorite}
            />
          )}
        </>
      ) : (
        <Favorites
          favorites={favorites}
          fetchWeatherData={fetchWeatherData}
          removeFavorite={removeFavorite}
        />
      )}
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";

const Favorites = ({ favorites, removeFavorite }) => {
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=75cbbbe302d33d728e1428447c1abe0a`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  };

  const updateFavorite = async (id) => {
    if (editText.trim() === "") return;
    await axios.patch(`http://localhost:5000/favorites/${id}`, {
      city: editText,
    });
    setEditing(null);
    setEditText("");
    window.location.reload(); // Temporary solution to refresh favorites list
  };

  const startEditing = (favorite) => {
    setEditing(favorite.id);
    setEditText(favorite.city);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (const favorite of favorites) {
        const weather = await fetchWeather(favorite.city);
        if (weather) {
          data.push({
            id: favorite.id,
            city: favorite.city,
            weather: {
              temperature: weather.main.temp,
              description: weather.weather[0].description,
              humidity: weather.main.humidity,
              windSpeed: weather.wind.speed,
            },
          });
        }
      }
      setWeatherData(data);
    };

    fetchData();
  }, [favorites]); // Update weather data whenever favorites change

  return (
    <div className="favorites" id="favorites">
      <h2>Favorite Cities</h2>
      <ul>
        {weatherData.map((data) => (
          <li key={data.id}>
            {editing === data.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit city name"
              />
            ) : (
              <span>
                {data.city} - {data.weather.temperature}°C,{" "}
                {data.weather.description}
              </span>
            )}
            {editing === data.id ? (
              <button onClick={() => updateFavorite(data.id)}>Update</button>
            ) : (
              <button onClick={() => startEditing(data)}>Edit</button>
            )}
            <button onClick={() => removeFavorite(data.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;

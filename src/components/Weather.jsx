import React, { useEffect, useRef, useState } from "react";
import search_icon from "../assets/search_icon.png";
import clear from "../assets/clear.png";
import humidity from "../assets/humidity.png";
import wind from "../assets/wind.png";
import snow from "../assets/snow.png";
import rain from "../assets/rain.png";
import drizzle from "../assets/drizzle.png";
import cloud from "../assets/cloud.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [cityName, setCityName] = useState("London"); // शहर का नाम स्टेट

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || clear;

      setWeatherData({
        temperature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error In Fetching Weather Data");
    }
  };

  useEffect(() => {
    search(cityName); // डायनैमिक रूप से शहर के नाम से खोजें
  }, [cityName]); // `city` स्टेट के बदलाव पर `search` को कॉल करें

  return (
    <div className="bg-blue-700 p-10 rounded-lg flex flex-col items-center">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          className="h-12 text-xl border-0 outline-none rounded-full pl-6 text-stone-700 bg-slate-50"
          type="text"
          placeholder="Search"
        />
        <img
          className="w-12 p-4 bg-slate-50 rounded-full"
          src={search_icon}
          onClick={() => {
            setCityName(inputRef.current.value); // शहर के नाम को स्टेट में सेट करें
            //  search(inputRef.current.value); // यहाँ पर फौरन खोज करना चाहते हैं
          }}
          alt=""
        />
      </div>
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="w-36 my-7" />
          <p className="text-7xl text-white leading-none">
            {weatherData.temperature}°c
          </p>
          <p className="text-4xl text-white">{weatherData.location}</p>
          <div className="w-full mt-10 text-white flex justify-between">
            <div className="flex items-start gap-3 text-xl">
              <img className="w-6 mt-[10px]" src={humidity} alt="" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span className="block text-[16px]">Humidity</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-xl">
              <img className="w-6 mt-[10px]" src={wind} alt="" />
              <div>
                <p>{weatherData.windspeed} km/hr</p>
                <span className="block text-[16px]">Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;

"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [jumping, setJumping] = useState(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const cityCoordinates = {
    Taipei: { lat: 25.0478, lon: 121.5319 },
    Taichung: { lat: 24.1477, lon: 120.6736 },
    Tokyo: { lat: 35.6762, lon: 139.6503 },
    Kanazawa: { lat: 36.5613, lon: 136.6562 },
    Hokkaido: { lat: 43.064, lon: 141.346 },
    Seoul: { lat: 37.5665, lon: 126.978 },
    London: { lat: 51.5073, lon: -0.127 },
    France: { lat: 48.856, lon: 2.352 },
    Moscow: { lat: 55.755, lon: 37.617 },
  };

  const options = Object.keys(cityCoordinates);

  // 彈窗變數設定
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [tempCity, setTempCity] = useState("Taipei");
  const [selectedCity, setSelectedCity] = useState("Taipei");
  const [coordinates, setCoordinates] = useState(cityCoordinates["Taipei"]);

  const confirmCityChange = () => {
    setSelectedCity(tempCity);
    setCoordinates(cityCoordinates[tempCity]);
    closeModal();
  };

  const handleCityChange = (event) => {
    setTempCity(event.target.value);
  };

  // 彈跳動畫
  const handleIconClick = (index) => {
    setJumping(index);
    setTimeout(() => setJumping(null), 500); // 動畫結束後移除類
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 當下資料
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`
        );
        if (!currentResponse.ok) {
          throw new Error("Failed to fetch currentData");
        }
        const currentData = await currentResponse.json();
        console.log("Current data:", currentData); // 檢查
        const processedCurrentData = processCurrentData(currentData);
        console.log("Processed Current data:", processedCurrentData); // 檢查
        setCurrentWeather(processedCurrentData);

        // 預報資料
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`
        );
        if (!forecastResponse.ok) {
          throw new Error("Failed to fetch forecastData");
        }
        const forecastData = await forecastResponse.json();
        console.log("Raw forecast data:", forecastData); // 檢查
        const processedData = processForecastData(forecastData);
        console.log("Processed forecast data:", processedData); // 檢查
        setForecast(processedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllData();
  }, [coordinates]);

  // 整理 forecastData 的函數
  function processForecastData(data) {
    const days = {};

    data.list.forEach((item) => {
      const dateObj = new Date(item.dt * 1000);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const weekday = dateObj
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const date = `${month}/${day} (${weekday})`;

      console.log(date);

      if (!days[date]) {
        // 如果還不存在，初始化
        days[date] = {
          minTemp: Math.round(item.main.temp_min),
          maxTemp: Math.round(item.main.temp_max),
          humidity: Math.round(item.main.humidity),
          weather: item.weather[0].main,
          icon: item.weather[0].icon,
          weatherCount: {},
          iconCount: {},
        };
      } else {
        // 如果已經存在，更新
        days[date].minTemp = Math.min(
          days[date].minTemp,
          Math.round(item.main.temp_min)
        );
        days[date].maxTemp = Math.max(
          days[date].maxTemp,
          Math.round(item.main.temp_max)
        );
        days[date].humidity = Math.round(
          (days[date].humidity + item.main.humidity) / 2
        );
      }

      // 計數天氣描述和圖標
      const weather = item.weather[0].main;
      const icon = item.weather[0].icon.slice(0, -1);
      if (!days[date].weatherCount[weather]) {
        days[date].weatherCount[weather] = 1;
      } else {
        days[date].weatherCount[weather]++;
      }
      if (!days[date].iconCount[icon]) {
        days[date].iconCount[icon] = 1;
      } else {
        days[date].iconCount[icon]++;
      }
    });

    return Object.entries(days).map(([date, values]) => {
      const mostCommonWeather = Object.keys(values.weatherCount).reduce(
        (a, b) => (values.weatherCount[a] > values.weatherCount[b] ? a : b)
      );
      const mostCommonIcon = Object.keys(values.iconCount).reduce((a, b) =>
        values.iconCount[a] > values.iconCount[b] ? a : b
      );

      return {
        date,
        minTemp: values.minTemp,
        maxTemp: values.maxTemp,
        humidity: values.humidity,
        weather: mostCommonWeather,
        icon: mostCommonIcon,
      };
    });
  }

  // 整理 currentData 的函數
  // function processCurrentData(data) {
  //   return {
  //     ...data,
  //     main: {
  //       ...data.main,
  //       temp: Math.round(data.main.temp),
  //       temp_max: Math.round(data.main.temp_max),
  //       temp_min: Math.round(data.main.temp_min),
  //     },
  //   };
  // }

  function processCurrentData(data) {
    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      weather: data.weather[0].main,
    };
  }

  return (
    <>
      <div className={styles.container}>
        {/* 區塊一 */}
        {currentWeather && (
          <div className={styles.main_container}>
            <span className={styles.sticker}>TEMP NOW</span>
            <p className={styles.main_temp}>{currentWeather.temp}°</p>
            <p className={styles.main_city_name} onClick={openModal}>
              {selectedCity}
            </p>
            <div>
              <table className={styles.info_table}>
                <thead></thead>
                <tbody>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      Low Temp
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      {currentWeather.temp_min}°
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      High Temp
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      {currentWeather.temp_max}°
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      Humidity
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      {currentWeather.humidity}%
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      Condition
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      {currentWeather.weather}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 區塊二 */}
        <div className={styles.subtitle_container}>
          <span className={styles.sub_divider}></span>
          <span className={styles.subtitle}>
            Next Few Days Weather Forecast
          </span>
          <span className={styles.sub_divider}></span>
        </div>

        {/* 區塊三 */}
        {forecast && (
          <div className={styles.card_container}>
            {forecast.map((day, i) => (
              <div className={styles.card} key={i}>
                <p className={styles.card_date}>{forecast[i].date}</p>
                <div className={styles.card_main_info}>
                  <div className={styles.card_bg}>
                    <Image
                      src={`/icons/${forecast[i].icon}.png`}
                      alt="Weather icon"
                      width={80}
                      height={80}
                      className={`${styles.card_icon} ${
                        jumping === i ? styles.jump : ""
                      }`}
                      onClick={() => handleIconClick(i)}
                    ></Image>
                  </div>
                  <p className={styles.card_paragraph}>
                    {forecast[i].minTemp}°
                    <span className={styles.text_divider}></span>
                    {forecast[i].maxTemp}°
                  </p>
                  <p className={styles.card_sm_paragraph}>
                    {forecast[i].weather}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 錯誤提醒 */}
      {error && (
        <div className={styles.container}>
          <p className="styles.error">{error}</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal}>
            <p className={styles.modal_title}>Select City</p>
            <div className={styles.custom_select}>
              <select
                name="cities"
                value={tempCity}
                onChange={handleCityChange}
                className={styles.styled_select}
              >
                {options.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.button_wrapper}>
              <button
                onClick={closeModal}
                className={styles.modal_button_border}
              >
                Close
              </button>
              <button
                className={styles.modal_button_bg}
                onClick={confirmCityChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

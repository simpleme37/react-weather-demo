"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [city, setCity] = useState("taipei");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const taipei_lon = 121.5319;
  const taipei_lat = 25.0478;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 當下資料
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${taipei_lat}&lon=${taipei_lon}&units=metric&appid=${API_KEY}`
        );
        if (!currentResponse.ok) {
          throw new Error("Failed to fetch currentData");
        }
        const currentData = await currentResponse.json();
        setCurrentWeather(currentData);
        // console.log(currentData);

        // 預報資料
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${taipei_lat}&lon=${taipei_lon}&units=metric&appid=${API_KEY}`
        );
        if (!forecastResponse.ok) {
          throw new Error("Failed to fetch forecastData");
        }
        const forecastData = await forecastResponse.json();
        console.log("Raw forecast data:", forecastData);
        const processedData = processForecastData(forecastData);
        console.log("Processed forecast data:", processedData);
        setForecast(processedData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAllData();
  }, [API_KEY]);

  // 整理資料的函數
  function processForecastData(data) {
    const days = {};

    data.list.forEach((item) => {
      const dateObj = new Date(item.dt * 1000);
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const weekday = dateObj
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const date = `${month}/${day}(${weekday})`;

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
      const icon = item.weather[0].icon;
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

  // 更改地點的函數
  const getWeather = async () => {};

  return (
    <>
      <div className={styles.container}>
        {/* 容器一 */}
        {currentWeather && (
          <div className={styles.main_container}>
            <span className={styles.sticker}>TEMP NOW</span>
            {/* TODO: 四捨五入 */}
            <p className={styles.main_temp}>{currentWeather.main.temp}</p>
            <p className={styles.main_city_name}>{currentWeather.name}</p>
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
                      {currentWeather.main.temp_min}°
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      High Temp
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      {currentWeather.main.temp_max}°
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      Humidity
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      {currentWeather.main.humidity}%
                    </td>
                  </tr>
                  <tr>
                    <td className={`${styles.table_td} ${styles.table_field}`}>
                      Condition
                    </td>
                    <td
                      className={`${styles.table_td} ${styles.table_content}`}
                    >
                      Clouds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 容器二 */}
        <div className={styles.subtitle_container}>
          <span className={styles.sub_divider}></span>
          <span className={styles.subtitle}>
            Weather Forecast for the Next Five Days
          </span>
          <span className={styles.sub_divider}></span>
        </div>

        {/* 容器三 */}
        {forecast && (
          <div className={styles.card_container}>
            {forecast.map((day, i) => (
              <div className={styles.card} key={i}>
                <p className={styles.card_date}>{forecast[i].date}</p>
                <div className={styles.card_main_info}>
                  <div className={styles.card_bg}>
                    <Image
                      src="/img_weather_01.svg"
                      alt="Weather icon"
                      width={80}
                      height={80}
                      className={styles.card_icon}
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
    </>
  );
}

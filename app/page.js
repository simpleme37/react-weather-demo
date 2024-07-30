"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [city, setCity] = useState("taipei");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const taipei_lon = 121.5319;
  const taipei_lat = 25.0478;

  // 範例
  // const testData = {
  //   list: [
  //     {
  //       dt: 1722200400,
  //       main: {
  //         temp: 28.05, // 溫度
  //         feels_like: 31.32, // 體感溫度
  //         temp_min: 26.38,
  //         temp_max: 28.05,
  //         pressure: 1009,
  //         sea_level: 1009,
  //         grnd_level: 1006,
  //         humidity: 74, // 濕度
  //         temp_kf: 1.67,
  //       },
  //       weather: [
  //         {
  //           id: 803,
  //           main: "Clouds", // 狀況
  //           description: "broken clouds", // 狀況詳細
  //           icon: "04n",
  //         },
  //       ],
  //       clouds: {
  //         all: 82,
  //       },
  //       wind: {
  //         speed: 2.69,
  //         deg: 121,
  //         gust: 6.15,
  //       },
  //       visibility: 10000,
  //       pop: 0,
  //       sys: {
  //         pod: "n",
  //       },
  //       dt_txt: "2024-07-28 21:00:00", // 日期時間
  //     },
  //     {
  //       dt: 1722211200,
  //       main: {
  //         temp: 29.15,
  //         feels_like: 33.25,
  //         temp_min: 29.15,
  //         temp_max: 29.28,
  //         pressure: 1008,
  //         sea_level: 1008,
  //         grnd_level: 1006,
  //         humidity: 71,
  //         temp_kf: -0.13,
  //       },
  //       weather: [
  //         {
  //           id: 803,
  //           main: "Clouds",
  //           description: "broken clouds",
  //           icon: "04d",
  //         },
  //       ],
  //       clouds: {
  //         all: 84,
  //       },
  //       wind: {
  //         speed: 3.81,
  //         deg: 128,
  //         gust: 7.12,
  //       },
  //       visibility: 10000,
  //       pop: 0,
  //       sys: {
  //         pod: "d",
  //       },
  //       dt_txt: "2024-07-29 00:00:00",
  //     },
  //   ],
  // };

  useEffect(() => {
    async function fetchTaipeiData() {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${taipei_lat}&lon=${taipei_lon}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();
        setWeatherData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching TaipeiData");
      }
    }
    // fetchTaipeiData();
  }, [API_KEY]);

  // 更改地點的函數
  const getWeather = async () => {};

  return (
    <>
      <div className={styles.container}>
        {/* 容器一 */}
        <div className={styles.main_container}>
          <p className={styles.main_temp}>18°</p>
          <p className={styles.main_city_name}>Taipei</p>
          <div className={styles.today_info}>
            <table className={styles.info_table}>
              <tr>
                <td className={`${styles.table_td} ${styles.table_field}`}>
                  最低
                </td>
                <td className={`${styles.table_td} ${styles.table_content}`}>
                  22°
                </td>
              </tr>
              <tr>
                <td className={`${styles.table_td} ${styles.table_field}`}>
                  最高
                </td>
                <td className={`${styles.table_td} ${styles.table_content}`}>
                  28°
                </td>
              </tr>
              <tr>
                <td className={`${styles.table_td} ${styles.table_field}`}>
                  濕度
                </td>
                <td className={`${styles.table_td} ${styles.table_content}`}>
                  55°
                </td>
              </tr>
              <tr>
                <td className={`${styles.table_td} ${styles.table_field}`}>
                  天氣描述
                </td>
                <td className={`${styles.table_td} ${styles.table_content}`}>
                  Clouds
                </td>
              </tr>
            </table>
          </div>
        </div>
        {/* 容器二 */}
        <div className={styles.subtitle_container}>
          <span className={styles.sub_divider}></span>
          <span className={styles.subtitle}>
            Weather Forecast for the Next Five Days
          </span>
          <span className={styles.sub_divider}></span>
        </div>
        {/* 容器三 */}
        <div className={styles.card_container}>
          <div className={styles.card}>
            <p className={styles.card_date}>7/30(MON)</p>
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
                22°<span className={styles.text_divider}></span>28°
              </p>
              <p className={styles.card_sm_paragraph}>Clouds</p>
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.card_date}>7/30(MON)</p>
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
                22°<span className={styles.text_divider}></span>28°
              </p>
              <p className={styles.card_sm_paragraph}>Clouds</p>
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.card_date}>7/30(MON)</p>
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
                22°<span className={styles.text_divider}></span>28°
              </p>
              <p className={styles.card_sm_paragraph}>Clouds</p>
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.card_date}>7/30(MON)</p>
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
                22°<span className={styles.text_divider}></span>28°
              </p>
              <p className={styles.card_sm_paragraph}>Clouds</p>
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.card_date}>7/30(MON)</p>
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
                22°<span className={styles.text_divider}></span>28°
              </p>
              <p className={styles.card_sm_paragraph}>Clouds</p>
            </div>
          </div>
        </div>
      </div>
      {/* 錯誤提醒 */}
      {/* <div className={styles.container}>
        <p className="styles.error">{error}</p>
      </div> */}
    </>
  );
}

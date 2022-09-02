import { useEffect, useRef, useState } from 'react';
import './App.css';

import LOCAL_API from "./data/localAPI.mjs"
import sampleData from './data/sampleData.mjs';
const customApiURL = LOCAL_API.getURL();


function App() {
    const [weatherHistories, setWeatherHistories] = useState([]);

    const updateWeatherHistories = async () => {
        const _weatherHistories = await fetch(LOCAL_API.getURL()).then(res => { return res.json(); })
        setWeatherHistories(_weatherHistories);
    }

    const effectRan = useRef(false);

    const countryCode = "US";
    // const API_KEY = "73b464eb3a7f94ef8f3283e728d7c1d0"
    const API_KEY = "593c0e6267ed9cc5b57ba1ba4cc85240"

    const getWeatherInfo = async (zipCode) => {
        const zipCodeData = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${API_KEY}`).then(res => { return res.json(); })
        console.log(`zipCodeData: `, zipCodeData)
        const zipCodeErrorMessage = zipCodeData.message;

        if (zipCodeErrorMessage) {
            console.log("Invalid zip code: ", zipCode);
        } else {
            console.log("valid zip code: ", zipCode);
            const { lat, lon } = zipCodeData;

            const weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`).then(res => { return res.json(); })
            console.log(`weatherData: `, weatherData);

            const weatherErrorMessage = weatherData.message;

            if (weatherErrorMessage && weatherErrorMessage !== "200") {
                console.log("Error: ", weatherErrorMessage);
            } else {
                const { base, clouds, coord, main, name, timezone, visibility, weather, wind } = weatherData;

                const { feels_like, humidity, pressure, temp, temp_max, temp_min } = main;
                const { description, icon, id } = weather[0];

                const weatherImgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                return {base, clouds, coord, name, timezone, visibility, wind, feels_like, humidity, pressure, temp, temp_max, temp_min, description, id, weatherImgURL}
            }
        }

    }

    const getFormattedDateTimeInUTC = (utcSecondsOffset, date) => {
        if (!utcSecondsOffset) {
            throw new Error(`Didn't receive utcSecondsOffset`)
        }

        if (!(date instanceof Date)) {
            throw new Error(`Not a date: ${date}`)
        }

        const utcHoursOffset = Number(utcSecondsOffset) / 3600

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const dateStr = `${month}/${day}/${year}`;

        let hours = (date.getHours() - utcHoursOffset);
        const period = hours < 12 ? "AM" : "PM";

        hours = ((hours + 11) % 12) + 1;

        let hoursStr = hours.toString().padStart(2, "0");
        let minutesStr = date.getMinutes().toString().padStart(2, "0");

        const time = `${hoursStr}:${minutesStr}`;
        const dateTime = `${dateStr} at ${time} ${period} UTC`;
        return dateTime;
    }

    const USING_SAMPLE_DATA = true

    const getLocalAPIData = async () => {
        const localData = await fetch(customApiURL).then(res => { return res.json(); })
        console.log(`localData: `, localData)
        return localData
    }

    
    // const data = await fetch(customApiURL, {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(newBeer),
    // })



    // export const WeatherHistory = sequelize.define("weather_histories", {
    //     zip: {
    //         type: Sequelize.INTEGER,
    //         // autoIncrement: true,
    //         allowNull: false,
    //         primaryKey: true
    //     },
    //     phrase: {
    //         type: Sequelize.STRING,
    //     }
    
    // })


    const postToLocalAPI = async (zipCode, weatherData) => {
        const postData = {
            "zip": zipCode,
            "data": weatherData,
        }

        const data = await fetch(customApiURL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

            body: JSON.stringify(postData)

        })
        return data
    }

    useEffect( () => {
        if (!effectRan.current) {
            effectRan.current = true;

            const effect = async () => {
                if (!USING_SAMPLE_DATA) {
                    updateWeatherHistories();
                    const weatherInfo = await getWeatherInfo(77539);
                    console.log(`weatherInfo: `, weatherInfo);
    
                    const formattedDateTimeInUTC = getFormattedDateTimeInUTC(weatherInfo.timezone, new Date());
                    console.log(`formattedDateTimeInUTC: `, formattedDateTimeInUTC);
                } else {

                    const postRes = await postToLocalAPI(77062, sampleData)
                    console.log(`postRes: `, postRes)
                }

            }
            effect();
        }

    }, [])

    const _getWeatherHistoryValue = (key) => {
        return weatherHistories.map(weatherHistory => {
            return weatherHistory[key];
        })
    }

    const getWeatherHistoryIDs = () => {
        return _getWeatherHistoryValue("id");
    }

    const getWeatherHistoryCities = () => {
        return _getWeatherHistoryValue("city");
    }


    const handleInput = (event) => {
        const element = event.target;
        const val = element.value;
        element.value = val.slice(0, 5);
    }

    return (
        <div className="App">
            Welcome to my App!
            <br/>
            customApiURL: {customApiURL}
            <br/>
            getWeatherHistoryIDs: {getWeatherHistoryIDs()}
            <br/>
            getWeatherHistoryCities: {getWeatherHistoryCities()}

            <input type={"number"}
                        name="zip-code"
                        id="zip-code"
                        placeholder="Enter your zip code"
                        onInput={handleInput}
                />
        </div>
    );
}

export default App;

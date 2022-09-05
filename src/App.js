import { useEffect, useRef, useState } from 'react';
import './App.css';

import LOCAL_API from "./data/localAPI.mjs"
import sampleData from './data/sampleData.mjs';
import validator from './data/patchValidator.mjs';



const customApiURL = LOCAL_API.getURL();
const MAX_HISTORY_SIZE = 3;

function App() {
    const [weatherHistories, setWeatherHistories] = useState([]);

    const updateWeatherHistories = async () => {
        const _weatherHistories = await fetch(LOCAL_API.getURL()).then(res => { return res.json(); })
        setWeatherHistories(_weatherHistories);
    }

    const effectRan = useRef(false);
    const countryCode = "US";
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



    const updateLocalAPI = async (zipCode, localData, newDataObj) => {
        if (!hasHistoricData(zipCode, localData)) {
            throw new Error(`No historic data for zip '${zipCode}' in local database. Use POST instead of PATCH/UPDATE`)
        }
        
        validator.assertArray(localData);
        validator.assertNonArrayObj(newDataObj);

        const { isValidPatchBody, WHERE } = validator;

        const body = {
            [WHERE]: {"zip": zipCode},
            "data": newDataObj,
        }

        if (!isValidPatchBody(body)) {
            throw new Error(`Invalid patch data: ${body}`)
        }

        const data = await fetch(customApiURL, {
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })

        console.log("update res data: ", data);
        return data;
    }

    const hasHistoricData = (zipCode, localData) => {
        if (isNaN(zipCode)) {throw new Error(`Not a number: ${zipCode}`)};
        if (!localData) {throw new Error(`Didn't receive localData`)};
        const historicZipCodes = getHistoricZipCodesFromLocalData(localData);
        return Boolean(historicZipCodes.includes(zipCode) || historicZipCodes.includes(String(zipCode)))
    }

    const postToLocalAPI = async (zipCode, localData, newDataArray) => {
        const postData = {
            "zip": zipCode,
            "data": newDataArray,
        }

        validator.assertArray(localData);
        validator.assertArray(newDataArray);

        const historicZipCodes = getHistoricZipCodesFromLocalData(localData);
        console.log(historicZipCodes)

        if (hasHistoricData(zipCode, localData)) {
            throw new Error(`zip '${zipCode}' already exists in local database. Use PATCH/UPDATE method instead of POST`)
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

    const getHistoricZipCodesFromLocalData = (localData) => {
        return localData.map(obj => {
            return obj.zip;
        })
    }

    const getHistoricDataArrayFromZipCode = (localData, zipCode) => {
        let matchingObj;

        for (let i = 0; i < localData.length; i++) {
            const obj = localData[i];
            if (String(obj["zip"]) === String(zipCode)) {
                matchingObj = obj;
                break;
            }
        }

        if (!matchingObj) {
            return []
        } else {
            console.log("matchingObj: ", matchingObj);

            const historicDataArray = matchingObj["data"];
            if (!Array.isArray(historicDataArray)) {
                console.log(`Not an array: `, historicDataArray);
                throw new Error(`Not an array: ${historicDataArray}`);
            }
    
            return historicDataArray;
        }
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

                    const TEST_ZIP_CODE = 12345
                    const TEST_NEW_OBJ = {test: "abcdefg"}

                    const localData = await getLocalAPIData()
                    console.log("localData: ", localData)

                    if (hasHistoricData(TEST_ZIP_CODE, localData)) {
                        console.log("historic data found. Updating.");

                        const historicDataArray = getHistoricDataArrayFromZipCode(localData, TEST_ZIP_CODE);
                        console.log("historicDataArray: ", historicDataArray);
                        console.log("historicDataArray.length === MAX_HISTORY_SIZE: ", historicDataArray.length === MAX_HISTORY_SIZE);
    
                        let newDataArray = historicDataArray.concat(TEST_NEW_OBJ);

                        if (historicDataArray.length >= MAX_HISTORY_SIZE){
                            newDataArray = newDataArray.slice(1, MAX_HISTORY_SIZE + 1);
                        }

                        console.log("newDataArray: ", newDataArray);
                        const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, {"data": newDataArray});
                        console.log(`updateRes: `, updateRes);
                    } else {
                        console.log("No historic data found. Posting.");
                        const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, [sampleData]);
                        console.log(`postRes: `, postRes);
                    }

                    const REFRESHED_LOCAL_DATA = await getLocalAPIData();
                    console.log("REFRESHED_LOCAL_DATA: ", REFRESHED_LOCAL_DATA)
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

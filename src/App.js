import { useRef, useState } from 'react';
import './App.scss';

import LOCAL_API from "./data/localAPI.mjs"
import validator from './data/patchValidator.mjs';
// import { WEATHER_HISTORY_ATTRIBUTES } from '../local-api/models/weatherModel';
import { WEATHER_HISTORY_ATTRIBUTES } from './local-api/models/weatherModel';
// import { WeatherHistory } from '../local-api/models/weatherModel';


import WeatherContainer from './containers/WeatherContainer/WeatherContainer';
import HistoricWeatherContainer from './containers/HistoricWeatherContainer/HistoricWeatherContainer';
import API_KEY from './data/API_KEY.mjs';


const customApiURL = LOCAL_API.getURL();
const MAX_HISTORY_SIZE = 3;

function App() {
    const [weatherHistories, setWeatherHistories] = useState([]);

<<<<<<< HEAD
    console.log("WEATHER_HISTORY_ATTRIBUTES: ", WEATHER_HISTORY_ATTRIBUTES);

    const updateWeatherHistories = async () => {
        const _weatherHistories = await fetch(LOCAL_API.getURL()).then(res => { return res.json(); })
        setWeatherHistories(_weatherHistories);
    }

    const effectRan = useRef(false);

=======
>>>>>>> bugfix
    const countryCode = "US";

    const getWeatherInfo = async (zipCode) => {
        const zipCodeData = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${API_KEY}`).then(res => { return res.json(); })
        console.log(`zipCodeData: `, zipCodeData)
        const zipCodeErrorMessage = zipCodeData.message;

        if (zipCodeErrorMessage) {
            alert("Invalid zip code: ", zipCode);
        } else {
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

                const time = getFormattedDateTimeInUTC(timezone, new Date());

                const weatherImgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                return {base, clouds, coord, name, timezone, time, visibility, wind, feels_like, humidity, pressure, temp, temp_max, temp_min, description, id, weatherImgURL}
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
<<<<<<< HEAD
        // validator.assertNonArrayObj(newDataObj);
=======
>>>>>>> bugfix
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

<<<<<<< HEAD
    // const postToLocalAPI = async (zipCode, localData, newDataObj) => {
    //     const postData = {
    //         "zip": zipCode,
    //         "data": newDataObj,
    //     }

    //     validator.assertArray(localData);
    //     // validator.assertNonArrayObj(newDataObj);
    //     validator.assertArray(newDataObj);

    //     const historicZipCodes = getHistoricZipCodesFromLocalData(localData);
    //     console.log(historicZipCodes)

    //     if (hasHistoricData(zipCode, localData)) {
    //         throw new Error(`zip '${zipCode}' already exists in local database. Use PATCH/UPDATE method instead of POST`)
    //     }

    //     const data = await fetch(customApiURL, {
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json'
    //         },

    //         body: JSON.stringify(postData)
    //     })

    //     return data
    // }

=======
>>>>>>> bugfix
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

<<<<<<< HEAD
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

                    // const postRes = await postToLocalAPI(77062, sampleData)
                    // console.log(`postRes: `, postRes)

                    const TEST_ZIP_CODE = 12345
                    const TEST_NEW_OBJ = {test: "abcdefg"}

                    const localData = await getLocalAPIData()
                    console.log("localData: ", localData)




                    // ..............

                    if (hasHistoricData(TEST_ZIP_CODE, localData)) {
                        console.log("historic data found. Updating.");

                        const historicDataArray = getHistoricDataArrayFromZipCode(localData, TEST_ZIP_CODE);
                        console.log("historicDataArray: ", historicDataArray);
                        console.log("historicDataArray.length === MAX_HISTORY_SIZE: ", historicDataArray.length === MAX_HISTORY_SIZE);
    
                        let newDataArray = historicDataArray.concat(TEST_NEW_OBJ);

                        if (historicDataArray.length >= MAX_HISTORY_SIZE){
                            newDataArray = newDataArray.slice(1, MAX_HISTORY_SIZE + 1);
                        }

                        // if (historicDataArray.length === MAX_HISTORY_SIZE){
                        //     newDataArray = historicDataArray.slice(1, MAX_HISTORY_SIZE + 1).concat(TEST_NEW_OBJ);
                        // } else {
                        //     newDataArray = historicDataArray.concat(TEST_NEW_OBJ);
                            
                        // }

                        console.log("newDataArray: ", newDataArray);


                        // const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, [sampleData]);
                        // const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, [TEST_NEW_OBJ]);
                        // const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, {"data": {"a": 345}});
                        const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, {"data": newDataArray});
                        console.log(`updateRes: `, updateRes);
                    } else {
                        console.log("No historic data found. Posting.");
                        // const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, [sampleData]);
                        // const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, {"data": sampleData});
                        const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, [sampleData]);
                        console.log(`postRes: `, postRes);
                    }


                    const REFRESHED_LOCAL_DATA = await getLocalAPIData();
                    console.log("REFRESHED_LOCAL_DATA: ", REFRESHED_LOCAL_DATA)

                    // const postRes = await postToLocalAPI(TEST_ZIP_CODE, [sampleData])


                    // const postRes = await postToLocalAPI(12345, {history: ["a", "b", "c"]})
                    
                    
                    
                    
                    // const postRes = await postToLocalAPI(TEST_ZIP_CODE, [{a: 1}, {b:2}, {c:3}])
                    // console.log(`postRes: `, postRes)

                    // const postRes = await postToLocalAPI(90210, sampleData)
                    // console.log(`postRes: `, postRes)

                    




                    // updateHistoricZipCode(localData, TEST_ZIP_CODE)

                    // const historicZipCodes = await getHistoricZipCodes()
                    // console.log("historicZipCodes: ", historicZipCodes)
                    


                    // const historicDataArray = getHistoricDataArrayFromZipCode(localData, TEST_ZIP_CODE);
                    // console.log("historicDataArray: ", historicDataArray);

                    // console.log("historicDataArray.length === MAX_HISTORY_SIZE: ", historicDataArray.length === MAX_HISTORY_SIZE);

                    // let TEST_NEW_OBJ = {x:999};

                    // if (historicDataArray.length === MAX_HISTORY_SIZE){
                    //     const newDataArray = historicDataArray.slice(1).concat(TEST_NEW_OBJ)
                    //     console.log("newDataArray: ", newDataArray)

                    //     // const postRes = await postToLocalAPI(TEST_ZIP_CODE, newDataArray)
                    //     // console.log(`postRes: `, postRes)

                    //     // const updated_local_data = await getLocalAPIData();
                    //     // console.log("updated_local_data: ", updated_local_data)
                    // }




                }
=======

    const postOrPatchWeatherData = async (zipCode) => {
        const weatherInfo = await getWeatherInfo(zipCode);
        searchedWeatherData.current = weatherInfo;

        const localData = await getLocalAPIData()
        console.log("localData: ", localData)

        if (hasHistoricData(zipCode, localData)) {
            console.log("historic data found. Updating.");

            const historicDataArray = getHistoricDataArrayFromZipCode(localData, zipCode);
            console.log("historicDataArray: ", historicDataArray);
            console.log("historicDataArray.length === MAX_HISTORY_SIZE: ", historicDataArray.length === MAX_HISTORY_SIZE);

            let newDataArray = historicDataArray.concat(weatherInfo);
>>>>>>> bugfix

            if (historicDataArray.length >= MAX_HISTORY_SIZE){
                newDataArray = newDataArray.slice(1, MAX_HISTORY_SIZE + 1);
            }

            historicDataRef.current = newDataArray;

            console.log("newDataArray: ", newDataArray);
            const updateRes = await updateLocalAPI(zipCode, localData, {"data": newDataArray});
            console.log(`updateRes: `, updateRes);
        } else {
            console.log("No historic data found. Posting.");
            const postRes = await postToLocalAPI(zipCode, localData, [weatherInfo]);
            console.log(`postRes: `, postRes);
        }

        const REFRESHED_LOCAL_DATA = await getLocalAPIData();
        console.log("REFRESHED_LOCAL_DATA: ", REFRESHED_LOCAL_DATA)
        return REFRESHED_LOCAL_DATA;    
    }

    const handleInput = (event) => {
        const element = event.target;
        const val = element.value;
        element.value = val.slice(0, 5);
    }

    const inputElement = useRef(null);
    const searchedWeatherData = useRef(null);
    const historicDataRef = useRef([]);

    const handleFetchButtonClick = async () => {
        const input = inputElement.current.value;
        if (input.length !== 5) {
            alert("Please enter a 5-digit zip code")
        } else {
            const zipCode = parseInt(input);
            const refreshed_local_data = await postOrPatchWeatherData(zipCode);
            console.log("successful post/patch")
            setWeatherHistories(refreshed_local_data)
        }
    }

    return (
        <div className="App">
            <div className='wrapper'>
                <div id="search-row">
                    <input onInput={handleInput} ref={inputElement} type={"number"} name="zip-code" id="zip-code" placeholder="Enter your zip code" />
                    <button onClick={handleFetchButtonClick}>Fetch</button>
                </div>

                { searchedWeatherData.current && <WeatherContainer data={searchedWeatherData.current}/> }
                { historicDataRef.current.length > 0 && 
                    <>
                        
                        <HistoricWeatherContainer historicDataArray={historicDataRef.current}/>
                    </>
                }
            </div>
        </div>
    );
}

export default App;

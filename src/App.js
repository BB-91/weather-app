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



    const updateLocalAPI = async (zipCode, localData, newDataObj) => {
        if (!hasHistoricData(zipCode, localData)) {
            throw new Error(`No historic data for zip '${zipCode}' in local database. Use POST instead of PATCH/UPDATE`)
        }
        
        // validator.assertNonArrayObj(localData);
        validator.assertArray(localData);
        validator.assertNonArrayObj(newDataObj);


        // if (!Array.isArray(localData)) {
        //     console.log(`Not an array: `, localData);
        //     throw new Error(`localDatais not an array`);
        // }

        // if (typeof newDataObj !== "object" || Array.isArray(newDataObj)) {
        //     console.log(`Not a non-array object: `, newDataObj);
        //     throw new Error(`newDataObj must be a non-array object`);
        // }



        // try delete then post. put/patch not working at all.
        // todo: check localData, assert that it contains a key found in the newDataObj



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
            // method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })
        // .then(res => res.json())

        console.log("update res data: ", data);
        return data;
    }

    // const postToLocalAPI = async (zipCode, weatherData) => {
    //     const postData = {
    //         "zip": zipCode,
    //         "data": weatherData,
    //     }

    const hasHistoricData = (zipCode, localData) => {
        if (isNaN(zipCode)) {throw new Error(`Not a number: ${zipCode}`)};
        if (!localData) {throw new Error(`Didn't receive localData`)};
        const historicZipCodes = getHistoricZipCodesFromLocalData(localData);
        return Boolean(historicZipCodes.includes(zipCode) || historicZipCodes.includes(String(zipCode)))
    }

    const postToLocalAPI = async (zipCode, localData, newDataObj) => {
        const postData = {
            "zip": zipCode,
            "data": newDataObj,
        }


        // validator.assertNonArrayObj(localData);
        validator.assertArray(localData);
        validator.assertNonArrayObj(newDataObj);

        // if (!localData) {throw new Error(`Didn't receive localData`)}
        // if (!postDataArray) {throw new Error(`Didn't receive postDataArray`)}

        // // if (!localData.length) {throw new Error(`localData array is empty`)}
        // if (!postDataArray.length) {throw new Error(`postDataArray array is empty`)}


        const historicZipCodes = getHistoricZipCodesFromLocalData(localData);
        console.log(historicZipCodes)

        if (hasHistoricData(zipCode, localData)) {
            throw new Error(`zip '${zipCode}' already exists in local database. Use PATCH/UPDATE method instead of POST`)
        }

        // if (historicZipCodes.includes(zipCode) || historicZipCodes.includes(String(zipCode))) {
        //     console.log("FOUND EXISTING ENTRY!!!!!!!!!!!!!")
        //     throw new Error(`zip '${zipCode}' already exists in local database. Use PATCH/UPDATE method instead of POST`)
        // }

        const jsonStr = JSON.stringify(postData)
        console.log("jsonStr: ", jsonStr)
        // const jsonStrAsStr = `${jsonStr}`
        // console.log("jsonStrAsStr: ", jsonStrAsStr)

        // console.log("jsonStr === jsonStrAsStr: ", jsonStr === jsonStrAsStr)
        // console.log("typeof (jsonStr):", typeof (jsonStr))
        // console.log("typeof (jsonStrAsStr):", typeof (jsonStrAsStr))

        // const dblStr = jsonStr + "_______" + jsonStr
        // console.log("dblStr: ", dblStr)

        


        const data = await fetch(customApiURL, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

            body: JSON.stringify(postData) // {data: [{...}, {...}, {...}]}
            // body: `${JSON.stringify(postData)}`
            // body: jsonStr
        })
        // .then(res => res.json())

        console.log("post res data: ", data)

        // .then(res => res.json());
        // console.log(data)
        return data
    }

    // const postToLocalAPI = async (zipCode, localData, postDataArray) => {
    //     const postData = {
    //         "zip": zipCode,
    //         "data": postDataArray,
    //     }


    //     // validator.assertNonArrayObj(localData);
    //     // validator.assertNonArrayObj(newDataObj);

    //     if (!localData) {throw new Error(`Didn't receive localData`)}
    //     if (!postDataArray) {throw new Error(`Didn't receive postDataArray`)}

    //     // if (!localData.length) {throw new Error(`localData array is empty`)}
    //     if (!postDataArray.length) {throw new Error(`postDataArray array is empty`)}


    //     const historicZipCodes = getHistoricZipCodesFromLocalData(localData);
    //     console.log(historicZipCodes)

    //     if (hasHistoricData(zipCode, localData)) {
    //         throw new Error(`zip '${zipCode}' already exists in local database. Use PATCH/UPDATE method instead of POST`)
    //     }

    //     // if (historicZipCodes.includes(zipCode) || historicZipCodes.includes(String(zipCode))) {
    //     //     console.log("FOUND EXISTING ENTRY!!!!!!!!!!!!!")
    //     //     throw new Error(`zip '${zipCode}' already exists in local database. Use PATCH/UPDATE method instead of POST`)
    //     // }

    //     const jsonStr = JSON.stringify(postData)
    //     console.log("jsonStr: ", jsonStr)
    //     // const jsonStrAsStr = `${jsonStr}`
    //     // console.log("jsonStrAsStr: ", jsonStrAsStr)

    //     // console.log("jsonStr === jsonStrAsStr: ", jsonStr === jsonStrAsStr)
    //     // console.log("typeof (jsonStr):", typeof (jsonStr))
    //     // console.log("typeof (jsonStrAsStr):", typeof (jsonStrAsStr))

    //     // const dblStr = jsonStr + "_______" + jsonStr
    //     // console.log("dblStr: ", dblStr)

        


    //     const data = await fetch(customApiURL, {
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json'
    //         },

    //         body: JSON.stringify(postData) // {data: [{...}, {...}, {...}]}
    //         // body: `${JSON.stringify(postData)}`
    //         // body: jsonStr
    //     })
    //     // .then(res => res.json())

    //     console.log("post res data: ", data)

    //     // .then(res => res.json());
    //     // console.log(data)
    //     return data
    // }

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
                throw new Error(`Not an array: `, historicDataArray);
            }
    
            return historicDataArray;
        }
    }

    // const getHistoricZipCodesFromLocalData = async (localData) => {
    //     const historicZipCodes = []
    //     localData.forEach(obj => {
    //         const { zip } = obj
    //         historicZipCodes.push(zip)
    //     })
    //     return historicZipCodes
    // }

    // const getHistoricZipCodesFromLocalData = async (localData) => {
    //     const historicZipCodes = []
    //     const localData = await getLocalAPIData()
    //     localData.forEach(obj => {
    //         const { zip } = obj
    //         historicZipCodes.push(zip)
    //     })
    //     return historicZipCodes
    // }

    // const updateHistoricZipCode = async (localData, zipCode) => {
    //     console.log("updating zip code: ", zipCode)
    //     const historicZipCodes = getHistoricZipCodesFromLocalData(localData)
    //     console.log("historicZipCodes: ", historicZipCodes)
    // }


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

                    if (hasHistoricData(TEST_ZIP_CODE, localData)) {
                        console.log("historic data found. Updating.");
                        // const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, [sampleData]);
                        // const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, [TEST_NEW_OBJ]);
                        const updateRes = await updateLocalAPI(TEST_ZIP_CODE, localData, {"data": {"a": 345}});
                        console.log(`updateRes: `, updateRes);
                    } else {
                        console.log("No historic data found. Posting.");
                        // const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, [sampleData]);
                        // const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, {"data": sampleData});
                        const postRes = await postToLocalAPI(TEST_ZIP_CODE, localData, sampleData);
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

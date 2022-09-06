import React from 'react';
import "./WeatherContainer.scss";
import { getTitleCaseFromSpaced } from '../../data/util.mjs';


const getDisplayedWeatherElements = (props) => {
    // const data = searchedWeatherData.current;
    const { data } = props;
    if (!data) {
        return (
            <></>
        )
    } else {
        // const { base, clouds, coord, name, timezone, visibility, wind, feels_like, humidity, pressure, temp, temp_max, temp_min, description, id, weatherImgURL } = data;
        const { name, time, feels_like, humidity, temp, temp_max, temp_min, description, weatherImgURL } = data;
        return (
            <>
                <img src={weatherImgURL} alt="weather"></img>
                <p>{name}</p>
                <p>{getTitleCaseFromSpaced(description)}</p>
                <p>Humidity: {humidity}%</p>
                <span>{time}</span>
                <div className='temp-current-row'>
                    <span>Curent: {temp}°</span>
                    <span>Low: {temp_min}°</span>
                </div>
                <div className='temp-range-row'>
                    <span>( Feels like: {feels_like}° )</span>
                    <span>High: {temp_max}°</span>
                </div>
                
            </>
        )
    }
}


const WeatherContainer = (props) => {
  return (
    <div id="weather-container">
        {getDisplayedWeatherElements(props)}
    </div>
  )
}

export default WeatherContainer;
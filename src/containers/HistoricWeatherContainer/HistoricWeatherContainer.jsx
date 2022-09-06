import React from 'react';
import WeatherContainer from '../WeatherContainer/WeatherContainer';
import "./HistoricWeatherContainer.scss";

const HistoricWeatherContainer = (props) => {
    const { historicDataArray } = props;
    const reversedHistoricDataArray = [...historicDataArray].reverse()

    const getHistoricContainers = () => {
        const historicContainers = reversedHistoricDataArray.map((data, index) => {
            return <WeatherContainer data={data} key={index}/>
        })
        return historicContainers;
    }

    // console.log("HistoricWeatherContainer -> historicDataArray: ", historicDataArray)

    return (
        <div id="historic-weather-container">
            <h3>Historic data for this zip code:</h3>
            { reversedHistoricDataArray && reversedHistoricDataArray.length > 0 && getHistoricContainers() }
        </div>
    )
}

export default HistoricWeatherContainer;
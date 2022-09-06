import React from 'react';
import "./HistoricWeatherContainer.scss";

const HistoricWeatherContainer = (props) => {
    const { historicDataArray } = props;
    return (
        <div id="historic-weather-container"></div>
    )
}

export default HistoricWeatherContainer;
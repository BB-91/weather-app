import { useEffect, useRef, useState } from 'react';
import './App.css';

import LOCAL_API from "./data/localAPI.mjs"
const customApiURL = LOCAL_API.getURL();

function App() {
    const [weatherHistories, setWeatherHistories] = useState([]);

    const updateWeatherHistories = async () => {
        const _weatherHistories = await fetch(LOCAL_API.getURL()).then(res => { return res.json(); })
        setWeatherHistories(_weatherHistories);
    }

    const effectRan = useRef(false);

    useEffect( () => {
        if (!effectRan.current) {
            effectRan.current = true;
            updateWeatherHistories();
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

    return (
        <div className="App">
            Welcome to my App!
            <br/>
            customApiURL: {customApiURL}
            <br/>
            getWeatherHistoryIDs: {getWeatherHistoryIDs()}
            <br/>
            getWeatherHistoryCities: {getWeatherHistoryCities()}
        </div>
    );
}

export default App;

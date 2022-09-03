import {Sequelize} from "sequelize";
import { sequelize } from "../db/index.js";

// {
//     Austin: {...},
// }


// {
//     Austin: {
//         0: {...},
//         1: {...},
//         2: {...}
//     }

// }


export const WeatherHistory = sequelize.define("weather_histories", {
    zip: {
        type: Sequelize.INTEGER,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    // data: {
    //     type: Sequelize.JSON,
    // }

    data: {
        type: Sequelize.JSON,
        // type: Sequelize.STRING,
    }

})

export const WEATHER_HISTORY_ATTRIBUTES = WeatherHistory.getAttributes();

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


    // data: {
    //     type: Sequelize.JSON,
    // }


// export const WeatherHistory = sequelize.define("weather_histories", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     city: {
//         type: Sequelize.STRING,
//     }
// })
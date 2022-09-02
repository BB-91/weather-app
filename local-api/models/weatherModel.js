import {Sequelize} from "sequelize";
import { sequelize } from "../db/index.js";


export const WeatherHistory = sequelize.define("weather_histories", {
    zip: {
        type: Sequelize.INTEGER,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data: {
        type: Sequelize.JSON,
    }

})

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
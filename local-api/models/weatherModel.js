import {Sequelize} from "sequelize";
import { sequelize } from "../db/index.js";


export const WeatherHistory = sequelize.define("weather_histories", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    city: {
        type: Sequelize.STRING,
    }
})
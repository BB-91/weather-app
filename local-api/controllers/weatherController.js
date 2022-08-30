import { WeatherHistory } from "../models/weatherModel.js";
// const imgFolder = "http://localhost:3010/images/"

export const getWeatherHistory = (req, res) => {
    WeatherHistory.findAll()
        .then(history => {
            res.status(200).send(history)
        })
        .catch(err => {
            console.log(err)
        })
};

export const addWeatherHistory = (req, res) => {
    const { id, city } = req.body;

    WeatherHistory.create({
        id,
        city,
    })
        .then(() => {
            res.status(201).send({ message: "Created" })
        })
        .catch(err => {
            console.log(err)
        })
};
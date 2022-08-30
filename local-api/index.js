import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/weatherAPI.js";
import { sequelize } from "./db/index.js";
// import { LOCAL_API } from "../src/data/localAPI.js"
// import LOCAL_API from "../src/data/localAPI.js"
import LOCAL_API from "../src/data/localAPI.mjs"
// import LocalAPI from "../src/data/localAPI.mjs"

const app = express();
const port = process.env.PORT || LOCAL_API.PORT;
// const port = process.env.PORT || LocalAPI.PORT;

sequelize.sync()
.then(result => {
    console.log(`result: `, result);
})
.catch(err => {
    console.log(`err: `, err)
})

app.use(bodyParser.json());
app.use(cors({origin: "*"}))
// app.use(cors({origin: LOCAL_API.getOrigin()}))
// app.use('/images', express.static('images'));
app.use(LOCAL_API.PATH, router);
// app.use(LocalAPI.PATH, router);

app.listen(port, (req, res) => {
    console.log("Server is running on port " + port);
});
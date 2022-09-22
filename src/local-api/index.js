import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes/weatherAPI.js";
import { sequelize } from "./db/index.js";
<<<<<<< HEAD:src/local-api/index.js
// import { LOCAL_API } from "../src/data/localAPI.js"
// import LOCAL_API from "../src/data/localAPI.js"
// import LOCAL_API from "../src/data/localAPI.mjs"
import LOCAL_API from "../data/localAPI.mjs";
// import LocalAPI from "../src/data/localAPI.mjs"
=======
import LOCAL_API from "../src/data/localAPI.mjs"
>>>>>>> bugfix:local-api/index.js

const app = express();
const port = process.env.PORT || LOCAL_API.PORT;

sequelize.sync()
.then(result => {
    console.log(`result: `, result);
})
.catch(err => {
    console.log(`err: `, err)
})

app.use(cors({origin: "http://localhost:3000"}))
app.use(bodyParser.json());
app.use(LOCAL_API.PATH, router);

app.listen(port, (req, res) => {
    console.log("Server is running on port " + port);
});
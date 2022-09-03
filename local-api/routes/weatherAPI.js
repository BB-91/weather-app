import Router from "express";
// import { getBeers, addBeer } from "../controllers/weatherController.js"
import { getWeatherHistory, addWeatherHistory, updateWeatherHistory } from "../controllers/weatherController.js"
const router = Router();

// router.get("/", getWeatherHistory);
// router.post("/", addWeatherHistory);
// router.patch("/", updateWeatherHistory)


router.get("/", getWeatherHistory);
router.post("/", addWeatherHistory);
router.patch("/", updateWeatherHistory)

// router.put("/", updateWeatherHistory)


// router.get("/", getBeers);
// router.post("/", addBeer);

export default router;

// import Router from "express";
// import { getBeers, addBeer } from "../controllers/weatherController.js"
// const router = Router();

// router.get("/", getBeers);
// router.post("/", addBeer);

// export default router;
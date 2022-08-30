import Router from "express";
// import { getBeers, addBeer } from "../controllers/weatherController.js"
import { getWeatherHistory, addWeatherHistory } from "../controllers/weatherController.js"
const router = Router();

router.get("/", getWeatherHistory);
router.post("/", addWeatherHistory);

// router.get("/", getBeers);
// router.post("/", addBeer);

export default router;

// import Router from "express";
// import { getBeers, addBeer } from "../controllers/weatherController.js"
// const router = Router();

// router.get("/", getBeers);
// router.post("/", addBeer);

// export default router;
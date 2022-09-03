import { WeatherHistory } from "../models/weatherModel.js";    
// const imgFolder = "http://localhost:3010/images/"

import validator from "../../src/data/patchValidator.mjs";

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
    WeatherHistory.create(req.body)
        .then(() => {
            res.status(201).send({ message: "Created" })
        })
        .catch(err => {
            console.log(err)
        })
};

// const assertOneKeyValuePair = (obj) => {
//     if (typeof(obj) !== "object") {
//         throw new Error(`Expected object data type. Got ${typeof(obj)}, ${obj}`)
//     }

//     const keys = Object.keys(obj);
//     const values = Object.values(obj);

//     if (keys.length !== 1) {
//         throw new Error(`Expected obj with 1 key. Got: ${obj}`)
//     }

//     if (values.length !== 1) {
//         throw new Error(`Expected obj with 1 value. Got: ${obj}`)
//     }
// }

// const assertOneKeyValuePair = (obj) => {
//     if (typeof(obj) !== "object") {
//         throw new Error(`Expected object data type. Got ${typeof(obj)}, ${obj}`)
//     }

//     const keys = Object.keys(obj);
//     const values = Object.values(obj);

//     if (keys.length !== 1) {
//         throw new Error(`Expected obj with 1 key. Got: ${obj}`)
//     }

//     if (values.length !== 1) {
//         throw new Error(`Expected obj with 1 value. Got: ${obj}`)
//     }
// }



// const assertObj = (obj) => {
//     if (typeof(obj) !== "object") {
//         throw new Error(`Expected object data type. Got ${typeof(obj)}, ${obj}`)
//     }
// }

// const getOnlyKey = (obj) => {
//     assertObj(obj);
//     const keys = Object.keys(obj);
//     if (keys.length !== 1) { throw new Error(`Expected obj with 1 key. Got: ${obj}`) };
//     return keys[0];
// }

// const getOnlyValue = (obj) => {
//     assertObj(obj);
//     const values = Object.values(obj);
//     if (values.length !== 1) { throw new Error(`Expected obj with 1 value. Got: ${obj}`) };
//     return values[0];
// }

// const WHERE = "where";
// const UPDATE = "<UPDATE_KEY>"

// const _getPostObj = (body, which) => {
//     assertObj(body);
//     const keys = Object.keys(body);
//     if (keys.length !== 2) { throw new Error(`Expected body obj with 2 keys. Got: ${body}`) };

//     if (!keys.includes(WHERE)) { throw new Error(`Missing required key '${WHERE}' in body obj: ${body}`) }
//     const whereKeyIndex = keys.indexOf(WHERE);
//     const updateKeyIndex = 1 - whereKeyIndex; // 0 or 1 (if length == 2 (asserted above))
//     const updateKey = keys[updateKeyIndex];
//     if (updateKey === WHERE) { throw new Error(`Two '${WHERE}' keys found. No updateKey found: ${body}`)}

//     const whereObj = body[WHERE];
//     const updateObj = body[updateKey]

//     switch(which) {
//         case WHERE:
//             return whereObj;
//         case UPDATE:
//             return updateObj;
//         default:
//             throw new Error(`No case for '${which}'`);
//     }
// }


// const getUpdateObj = (body) => _getPostObj(body, UPDATE);
// const getWhereObj = (body) => _getPostObj(body, WHERE);

// const getUpdateKey = (body) => getOnlyKey(getUpdateObj(body));
// const getUpdateValue = (body) => getOnlyValue(getUpdateObj(body));

// const getWhereKey = (body) => getOnlyKey(getWhereObj(body));
// const getWhereValue = (body) => getOnlyValue(getWhereObj(body));

// const getUpdateKey = (obj) => {
//     assertObj(obj);
//     const keys = Object.keys(obj);
//     if (keys.length !== 2) { throw new Error(`Expected obj with 2 keys. Got: ${obj}`) };

//     const WHERE = "where";

//     if (!keys.includes(WHERE)) { throw new Error(`Missing required key '${WHERE}' in post obj: ${obj}`) }
//     const whereKeyIndex = keys.indexOf(WHERE);
//     const updateKeyIndex = 1 - whereKeyIndex; // 0 or 1 (if length == 2 (asserted above))
//     const updateKey = keys[updateKeyIndex];
//     if (updateKey === WHERE) { throw new Error(`Two '${WHERE}' keys found. No updateKey found: ${obj}`)}
//     return updateKey;
// }

// const getNonWhereKey = (obj) => {
//     assertValidPostObj(obj);
//     const whereKeyIndex = 
// }




/*
    body: {
        data: {...},
        where: {"zip": <int>}
    }
    {
        where: {"zip": 77062}
    }

*/


// export const addWeatherHistory = (req, res) => {
//     WeatherHistory.create(req.body)
//         .then(() => {
//             res.status(201).send({ message: "Created" })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// };

export const updateWeatherHistory = (req, res) => {
    const { body } = req;
    const { getUpdateKey, getUpdateValue, getWhereKey, getWhereValue, WHERE } = validator;

    const updateKey = getUpdateKey(body);
    const updateValue = getUpdateValue(body);

    const whereKey = getWhereKey(body)
    const whereValue = getWhereValue(body);

    console.log("updateKey: ", updateKey)
    console.log("updateValue: ", updateValue)
    console.log("whereKey: ", whereKey)
    console.log("whereValue: ", whereValue)

    WeatherHistory.update(
        { [updateKey]: updateValue},
        { [WHERE]: {[whereKey]: whereValue}}
    )
    .then(() => {
        res.status(200).send({ message: "Updated" })
    })
    .catch(err => {
        console.log(err)
    })
};

// export const updateWeatherHistory = (req, res) => {
//     const { body } = req;
    
//     const primaryKey = getOnlyKey(body);
//     const updateObj = getOnlyValue(body);

//     const keyToUpdate = getOnlyKey(updateObj);
//     const updatedValue = getOnlyValue(updateObj);

//     // const modified_key = 

//     // assertOneKeyValuePair(body)
//     // const keys = Object.keys(body);
//     // const values = Object.values(body);

//     // const primary_key = keys[0];
//     // const data = values[0];
    
//     // if (typeof(data) !== "object") {
//     //     throw new Error(`Expected object data type. Got ${data}`)
//     // }


//     WeatherHistory.update(
//         {
//             [keyToUpdate]: updatedValue
//         },
//         {
//             where: {}
//         }
//     )
// };

// export const updateWeatherHistory = (req, res) => {
//     const { body } = req;
//     const keys = Object.keys(body);
//     const values = Object.values(body);

//     if (keys.length !== 1) {
//         throw new Error(`Expected body obj with 1 key. Got: ${body}`)
//     }

//     if (values.length !== 1) {
//         throw new Error(`Expected body obj with 1 value. Got: ${body}`)
//     }

//     const primary_key = keys[0];
//     const data = values[0];
    
//     if (typeof(data) !== "object") {
//         throw new Error(`Expected object data type. Got ${data}`)
//     }


//     WeatherHistory.update(
//         {

//         }
//     )
// };

// export const addWeatherHistory = (req, res) => {
//     // const { zip, data } = req.body;

//     // WeatherHistory.create({
//     //     zip,
//     //     data,
//     // })

//     // const { zip, data } = req.body;

//     WeatherHistory.create(req.body)
//         .then(() => {
//             res.status(201).send({ message: "Created" })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// };

// export const addWeatherHistory = (req, res) => {
//     const { zip, data } = req.body;

//     WeatherHistory.create({
//         zip,
//         data,
//     })
//         .then(() => {
//             res.status(201).send({ message: "Created" })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// };


// updateWeatherHistory


// export const addWeatherHistory = (req, res) => {
//     const { zip, phrase } = req.body;

//     WeatherHistory.create({
//         zip,
//         phrase,
//     })
//         .then(() => {
//             res.status(201).send({ message: "Created" })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// };

// export const addWeatherHistory = (req, res) => {
//     const { id, city } = req.body;

//     WeatherHistory.create({
//         id,
//         city,
//     })
//         .then(() => {
//             res.status(201).send({ message: "Created" })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// };
class Validator {
    constructor() {
        this.assertObj = this.assertObj.bind(this);

        this.getOnlyKey = this.getOnlyKey.bind(this);
        this.getOnlyValue = this.getOnlyValue.bind(this);

        this._getPostObj = this._getPostObj.bind(this);
        this.isValidPatchBody = this.isValidPatchBody.bind(this);

        this.getUpdateObj = this.getUpdateObj.bind(this);
        this.getWhereObj = this.getWhereObj.bind(this);

        this.getUpdateKey = this.getUpdateKey.bind(this);
        this.getUpdateValue = this.getUpdateValue.bind(this);

        this.getWhereKey = this.getWhereKey.bind(this);
        this.getWhereValue = this.getWhereValue.bind(this);
    }

    WHERE = "where"
    UPDATE = "<UPDATE_KEY>"

    assertObj(obj) {
        if (typeof(obj) !== "object") {
            throw new Error(`Expected object data type. Got ${typeof(obj)}, ${obj}`)
        }
    }

    getOnlyKey(obj) {
        this.assertObj(obj);
        const keys = Object.keys(obj);
        if (keys.length !== 1) {
            console.log("obj: ", obj)
            throw new Error(`Expected obj with 1 key. Got: ${keys.length}`)
        };
        return keys[0];
    }
    
    getOnlyValue(obj) {
        this.assertObj(obj);
        const values = Object.values(obj);
        if (values.length !== 1) {
            console.log("obj: ", obj)
            throw new Error(`Expected obj with 1 value. Got: ${values.length}`)
        };
        return values[0];
    } 

    _getPostObj(body, which) {

        this.assertObj(body);
        const keys = Object.keys(body);
        const { WHERE, UPDATE } = this;

        // 2 keys: data: {...}, where: {primary_key: <string>}

        if (keys.length !== 2) {
            console.log("body: ", body);
            throw new Error(`Expected body obj with 2 keys. Got ${keys.length}.`)
        };

        // // 3 keys: primary_key, data, where

        // if (keys.length !== 3) {
        //     console.log("body: ", body);
        //     throw new Error(`Expected body obj with 3 keys. Got ${keys.length}.`)
        // };
    
        if (!keys.includes(WHERE)) {
            console.log("body: ", body);
            throw new Error(`Missing required key '${WHERE}' in body.`)
        }

        // const copy = {...body};
        // delete copy[WHERE];

        const whereKeyIndex = keys.indexOf(WHERE);
        const updateKeyIndex = 1 - whereKeyIndex; // 0 or 1 (if length == 2 (asserted above))
        const updateKey = keys[updateKeyIndex];
        if (updateKey === WHERE) {
            console.log("body: ", body);
            throw new Error(`Two '${WHERE}' keys found. No updateKey found.`)
        }
    
        const whereObj = body[WHERE];
        const updateObj = body[updateKey]
        

        

        switch(which) {
            case WHERE:
                return whereObj;
            case UPDATE:
                return updateObj;
            default:
                throw new Error(`No case for '${which}'`);
        }
    }

    isValidPatchBody(body) {
        // console.log("this: ", this);
        const whereObj = this._getPostObj(body, this.WHERE);
        return (whereObj != null && whereObj !== undefined);
    }
    
    getUpdateObj(body) { return this._getPostObj(body, this.UPDATE) }
    getWhereObj(body) { return this._getPostObj(body, this.WHERE) }
    
    getUpdateKey(body) { return this.getOnlyKey(this.getUpdateObj(body))}
    getUpdateValue(body) { return this.getOnlyValue(this.getUpdateObj(body))}
    
    getWhereKey(body) { return this.getOnlyKey(this.getWhereObj(body))}
    getWhereValue(body) { return this.getOnlyValue(this.getWhereObj(body))}


}

// const validator = {
//     WHERE: "where",
//     UPDATE: "<UPDATE_KEY>",
    
//     assertObj(obj) {
//         if (typeof(obj) !== "object") {
//             throw new Error(`Expected object data type. Got ${typeof(obj)}, ${obj}`)
//         }
//     },
    
//     getOnlyKey(obj) {
//         this.assertObj(obj);
//         const keys = Object.keys(obj);
//         if (keys.length !== 1) { throw new Error(`Expected obj with 1 key. Got: ${obj}`) };
//         return keys[0];
//     },
    
//     getOnlyValue(obj) {
//         this.assertObj(obj);
//         const values = Object.values(obj);
//         if (values.length !== 1) { throw new Error(`Expected obj with 1 value. Got: ${obj}`) };
//         return values[0];
//     },
    
//     _getPostObj(body, which) {
//         this.assertObj(body);
//         const keys = Object.keys(body);
//         const { WHERE, UPDATE } = this;

//         if (keys.length !== 2) { throw new Error(`Expected body obj with 2 keys. Got: ${body}`) };
    
//         if (!keys.includes(WHERE)) { throw new Error(`Missing required key '${WHERE}' in body obj: ${body}`) }
//         const whereKeyIndex = keys.indexOf(WHERE);
//         const updateKeyIndex = 1 - whereKeyIndex; // 0 or 1 (if length == 2 (asserted above))
//         const updateKey = keys[updateKeyIndex];
//         if (updateKey === WHERE) { throw new Error(`Two '${WHERE}' keys found. No updateKey found: ${body}`)}
    
//         const whereObj = body[WHERE];
//         const updateObj = body[updateKey]
    
//         switch(which) {
//             case WHERE:
//                 return whereObj;
//             case UPDATE:
//                 return updateObj;
//             default:
//                 throw new Error(`No case for '${which}'`);
//         }
//     },

//     isValidPatchBody(body) {
//         console.log("this: ", this);
//         const whereObj = this._getPostObj(body, this.WHERE);
//         return (whereObj != null && whereObj !== undefined);
//     },
    
//     getUpdateObj(body) { return this._getPostObj(body, this.UPDATE) },
//     getWhereObj(body) { return this._getPostObj(body, this.WHERE) },
    
//     getUpdateKey(body) { return this.getOnlyKey(this.getUpdateObj(body))},
//     getUpdateValue(body) { return this.getOnlyValue(this.getUpdateObj(body))},
    
//     getWhereKey(body) { return this.getOnlyKey(this.getWhereObj(body))},
//     getWhereValue(body) { return this.getOnlyValue(this.getWhereObj(body))},
// }

const validator = new Validator();

export default validator;
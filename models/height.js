const CENTIMETER_DIVISOR = 100;
const FEET_DIVISOR = 3048;
const COLLECTION_NAME = "heights";

/**
 * import our mongodb middleware
 */
const mongo = require("../utils/database.js");

function createHeightObject(p_name, p_male, p_female, p_is_country){
    /** validate the optional `is_country` parameter since missing parameters in javascript default to undefined and `is_country` is a boolean */
    p_is_country = (p_is_country === undefined)? false : p_is_country;

    let output = {
        name : p_name,
        male : p_male,
        female : p_female,
        is_country : p_is_country,
        getMaleCm : () => {
            return this.male / CENTIMETER_DIVISOR;
        },
        getFemaleCm : () => {
            return this.female / CENTIMETER_DIVISOR;
        },
        getMaleFt : () => {
            return this.male / FEET_DIVISOR;
        },
        getFemaleFt : () => {
            return this.female / FEET_DIVISOR;
        },
    };
    return output;
}

async function createRecord(p_record){
    try {
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.insertOne(p_record);
    }
    catch(error){
        throw error;
    }
}

async function readAllRecords(){
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.find({}).toArray();
    }
    catch(error){
        throw error;
    }
}

async function deleteRecord(p_name){
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.deleteOne({"name" : p_name});
    }
    catch(error){
        throw error;
    }
}

module.exports = {createHeightObject, createRecord, readAllRecords, deleteRecord};
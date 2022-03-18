const CENTIMETER_DIVISOR = 100;
const FEET_DIVISOR = 3048;
const COLLECTION_NAME = "heights";

/**
 * import our mongodb middleware
 */
const mongo = require("../utils/database.js");

/**
 * creates a new entry object for the database with the following parameters
 * 
 * rank is not recorded since rank can be calculated from the database
 * height in cm/ft are  not recorded since they are be calculated from the database as well
 * 
 * @param {String} p_name - name of country if entry is a country, or name of custom entry
 * @param {Number} p_male - height of male
 * @param {Number} p_female - height of female
 * @param {Boolean} p_is_country - optional boolean value specifying whether this entry is a country from the dataset or a custom value from the us
 * @returns {Object} - height object generated by the parameters
 */
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

/**
 * creates a new record in the collection with the following record object
 * @param {Object} p_record - record object obtained from createHeightObject
 * @returns {Object} - result object from mongodb.insertOne()
 */
async function createRecord(p_record){
    try {
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.insertOne(p_record);
    }
    catch(error){
        throw error;
    }
}

/**
 * returns all the records in the collection
 * @returns {Array(Object)} - array of objects representing all the records from the collection
 */
async function readAllRecords(){
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.find({}).toArray();
    }
    catch(error){
        throw error;
    }
}

/**
 * retreive records matching the name from the database
 * @param {String} p_name - name of the records to retreive
 * @returns {Array(Object)} the array of records matching the name specified
 */
async function readRecords(p_name){
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.find({"name" : p_name}).toArray();
    }
    catch(error){
        throw error;
    }
}

/**
 * extended function to retreive records allowing advance querying, sorting and limiting
 * @param {Object} p_query - object specifying the search query in the database; defaults to {}
 * @param {Object} p_sort - object specifying the sorting order of the query in the database; default sort order is name-by-descending order
 * @param {Number} p_limit - number specifying the limit of the search query; default limit is 0 (unlimited)
 * @returns 
 */
async function readRecordsEx(p_query, p_sort, p_limit){
    /** set default values for parameters */
    p_query = (p_query === undefined)? {} : p_query;
    p_sort = (p_sort === undefined)? {"name" : 1} : p_sort;
    p_limit = (p_limit === undefined)? 0 : p_limit;
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.find(p_query).sort(p_sort).limit(p_limit).toArray();
    }
    catch(error){
        throw error;
    }
}

/**
 * updates a record by name with a new record of updated values
 * @param {String} p_name - string containing the name of the record to update
 * @param {Object} p_new_record - new record containing updated values to replace the old record with
 * @returns {Object} the result object obtained from mongodb.updateOne()
 */
async function updateRecord(p_name, p_new_record){
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.updateOne({"name" : p_name}, {$set : p_new_record});
    }
    catch(error){
        throw error;
    }
}

/**
 * deletes the first record matching the specified name from the collection
 * @param {String} p_name - name of the record to delete
 * @returns {Object} - the result object from the mongodb.deleteOne() function
 */
async function deleteRecord(p_name){
    try{
        let collection = await mongo.getCollection(COLLECTION_NAME);
        return await collection.deleteOne({"name" : p_name});
    }
    catch(error){
        throw error;
    }
}

module.exports = {createHeightObject, createRecord, readAllRecords, readRecords, readRecordsEx, updateRecord, deleteRecord};
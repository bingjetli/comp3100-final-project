const IMPERIAL_CONVERSION_DIVISOR = 30.48;
const COLLECTION_NAME = "heights";

/**
 * import our mongodb middleware
 */
const mongo = require("../utils/database.js");

class Height {
    /**
     * we don't record the height in ft since that can be calculated from height in cm
     * rank is also not required since we can calculate it dynamically
     * 
     * @param {string} name - country name in the dataset or custom entry name
     * @param {float} male_cm  - male height in cm
     * @param {float} female_cm - female height in cm
     * @param {boolean} is_country - specifies whether this entry is part of the original dataset or a custom entry (optional)
     */
    constructor(name, male_cm, female_cm, is_country){
        /** validate the optional `is_country` parameter since missing parameters in javascript default to undefined and `is_country` is a boolean */
        is_country = (is_country === undefined)? false : is_country;
        this.name = name;
        this.male_cm = male_cm;
        this.female_cm = female_cm;
        this.is_country = is_country;
    }

    getMaleInFeet(){
        return this.male_cm / IMPERIAL_CONVERSION_DIVISOR;
    }

    getFemaleInFeet(){
        return this.female_cm / IMPERIAL_CONVERSION_DIVISOR;
    }

    /**
     * creates this record in the current database collection
     */
    async createRecord(){
        try{
            let collection = await mongo.getCollection(COLLECTION_NAME);
            await collection.insertOne(this, (error, result) => {
                console.log("successfully inserted record into collection `${COLLECTION_NAME}` : ${result.insertedId}");
            });
        }
        catch(error){
            throw error;
        }
    }

    /**
     * @returns {Array[Height]} - an array of all the records in the collection
     */
    static async readAll(){
        try {
            let collection = await mongo.getCollection(COLLECTION_NAME);
            return await collection.find({}).toArray((error, result) => {
                console.log("successfully retreived all records from `${COLLECTION_NAME}`");
            });
        }
        catch(error){
            throw error;
        }
    }

    static async deleteRecord(name){
        try{
            let collection = await mongo.getCollection(COLLECTION_NAME);
            await collection.deleteOne(name, (error, result) => {
                console.log("successfully deleted `${query}` from `${COLLECTION_NAME}`");
            });
        }
        catch(error){
            throw error;
        }
    }
};

module.exports.Height = Height;
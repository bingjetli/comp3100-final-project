/** /dataset/ controller
 * handles all routes related to /dataset/
 */

/** import height model */
const height_model = require("../models/heights");

/**
 * route handler for creating records
 * @param {*} request 
 * @param {*} response 
 */
module.exports.create_route = async (request, response) => {
    try {
        let name = request.body.name;
        let male = request.body.male_dmm;
        let female = request.body.female_dmm;
        let new_height = height_model.createHeightObject(name, male, female);
        let result = await height_model.createRecord(new_height);
        response.send("successfully created record : " + result);
        console.log("[dataset.js]: created record " + result);
    }
    catch(error){
        console.error(error);
        response.send(error);
    }
};

/**
 * route handler for reading records matching the specified name
 * @param {*} request 
 * @param {*} response 
 */
module.exports.read_route = async (request, response) => {
    try {
        let name = request.params.name;
        let results = await height_model.readRecord(name);
        response.send(results);
        console.log(results);
    }
    catch(error){
        console.error(error);
        response.send(error);
    }
};

/**
 * route handler for advanced read queries for the collection
 * @param {*} request 
 * @param {*} response 
 */
module.exports.read_ex_route = async (request, response) => {
    try {
        let search_query = request.body.search_query;
        let sort_query = request.body.sort_query;
        let limit = request.body.limit;
        let results = await height_model.readRecordEx(search_query, sort_query, limit);
        response.send(results);
        console.log(results);
    }
    catch(error){
        console.error(error);
        response.send(error);
    }
};

/**
 * route handler for updating a record with the specified property to update, and the updated value
 * @param {*} request 
 * @param {*} response 
 */
module.exports.update_route = async (request, response) => {
    try {
        let name = request.body.name;
        let new_name = request.body.new_name;
        let new_male_dmm = request.body.new_male_dmm;
        let new_female_dmm = request.body.new_female_dmm;
        let updated_record = height_model.createHeightObject(new_name, new_male_dmm, new_female_dmm);
        let result = await height_model.updateRecord(name, updated_record);
        response.send(result);
        console.log(result);
    }
    catch(error){
        console.error(error);
        response.send(error);
    }
};


/** route handler for deleting a record */
module.exports.delete_route = async (request, response) => {
    try{
        let name = request.params.name;
        let result = await height_model.deleteRecord(name);
        response.send(result);
        console.log(result);
    }
    catch(error){
        response.send("error deleting record: " + error);
        console.error(error);
    }
};

/** route handler for resetting the database with values from the dataset.csv */
module.exports.reset_database_route = async (request, response) => {
    try {
       let result = await height_model.resetDatabase();
       response.send(result);
       console.log(result);
    }
    catch (error){
        response.send(error);
        console.error(error);
    }
};
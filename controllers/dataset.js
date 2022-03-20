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
        response.send("success");
        console.log("created record: " + result.insertedId);
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

        /** send result as csv */
        let result_csv = "";
        if(results.length > 0){
            /** there is a result */
            result_csv = results[0].name + "," + results[0].male + "," + results[0].female;
        }
        response.send(result_csv);
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

        /** return a result_csv as a response */
        let result_csv = "";
        if(results.length > 0){
            /** if there are results */
            for(i = 0; i < results.length; i++){
                result_csv += results[i].name + "," + results[i].male + "," + results[i].female + "\n";
            }
        }
        response.send(result_csv);
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
        let result = await height_model.updateRecord(name, {
            name : new_name,
            male : new_male_dmm,
            female : new_female_dmm,
            is_country : false
        });
        response.send("success");
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
        response.send("success");
        console.log(result);
    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};

/** route handler for resetting the database with values from the dataset.csv */
module.exports.reset_database_route = async (request, response) => {
    try {
       let result = await height_model.resetDatabase();
       response.send("success");
       console.log(result.insertedIds);
    }
    catch (error){
        response.send(error);
        console.error(error);
    }
};
/** default controller
 * 
 * import Height model
 * import height_stats model
 */
const height_model = require("../models/heights");
const height_stats_model = require("../models/height_stats");

/**
 * handles the default request to the root route
 */
module.exports.default_route = (request, response) => {
    response.send("root route working perfectly!");
};

/**
 * route handler for testing 
 */
module.exports.debug_route = (request, response) => {
    response.send(request.params);

    console.log("calling foo from height model twice");
    height_model.foo();
    height_model.foo();

    console.log("calling foo from height_stats_model once");
    height_stats_model.foo();
};

/**
 * route handler for creating records
 * @param {*} request 
 * @param {*} response 
 */
module.exports.create_route = async (request, response) => {
    //response.send(request.params);
    try {
        let name = request.params.name;
        let male = request.params.male;
        let female = request.params.female;
        let new_height = height_model.createHeightObject(name, male, female);
        let result = await height_model.createRecord(new_height);
        response.send("successfully created record : " + result);
    }
    catch(error){
        console.error(error);
        response.send(error);
    }
};

/**
 * route handler for reading all records
 * @param {*} request 
 * @param {*} response 
 */
module.exports.read_all_route = async (request, response) => {
    try {
        let all_heights = await height_model.readAllRecords();
        response.send(all_heights);
        console.log(all_heights);
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
        let results = await height_model.readRecords(name);
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
        let name = request.params.name;
        let property_to_update = request.params.property_to_update;
        let updated_value = request.params.updated_value;
        let record = await height_model.readRecords(name);
        let updated_record = record[0];
        updated_record[property_to_update] = updated_value;
        let result = await height_model.updateRecord(name, updated_record);
        response.send(result);
        console.log(result);
    }
    catch(error){
        console.error(error);
        response.send(error);
    }
};


/**
 * route handler for deleting a record
 * @param {*} request 
 * @param {*} response 
 */
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

/**
 * route handler for clearing the entire collection
 * @param {*} request 
 * @param {*} response 
 */
module.exports.delete_all_route = async (request, response) => {
    try{
        let result = await height_model.deleteAll();
        response.send(result);
        console.log(result);
    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};

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

module.exports.generate_statistics_route = async (request, response) => {
    try {

    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};

/*
module.exports.generate_statistics_route = async (request, response) => {
    try {

    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};
*/
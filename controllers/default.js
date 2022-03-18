/** default controller
 * 
 * import Height model
 */
const height_model = require("../models/height");

/**
 * handles the default request to the root route
 */
module.exports.default_route = (request, response) => {
    response.send("root route working perfectly!");
};

/**
 * route handler to send back debugging information
 */
module.exports.debug_route = (request, response) => {
    response.send(request.params);
};

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
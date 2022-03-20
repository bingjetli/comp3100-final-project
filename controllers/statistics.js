/** /statistics/ controller
 * handles all routes related to /statistics/
 */

/** import our height_stats model */
const height_stats_model = require("../models/height_stats");

/** route handler for generating statistics */
module.exports.generate_statistics_route = async (request, response) => {
    try {
        let result = await height_stats_model.generateStatistics();
        response.send(result);
        console.log(result);
    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};

/** route handler for reading all statistics */
module.exports.read_all_route = async (request, response) => {
    try {
        let result = await height_stats_model.readAllRecords();
        response.send(result);
        console.log(result);
    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};

/** route handler for reading a specified statistic */
module.exports.read_route = async (request, response) => {
    try {
        let stat = request.params.stat;
        let result = await height_stats_model.readRecords(stat);
        response.send(result);
        console.log(result);
    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};

/** route handler for getting the percentile of a specific name in the COLLECTIONS.HEIGHTS according to a specified sex */
module.exports.get_percentile_route = async (request, response) => {
    try {
        let name = request.params.name;
        let sex = request.params.sex;
        let result = await height_stats_model.getPercentile(name, sex);
        response.send(result);
        console.log(result);
    }
    catch(error){
        response.send(error);
        console.error(error);
    }
};
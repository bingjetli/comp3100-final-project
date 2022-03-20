/** import our common modules */
const COLLECTIONS = require("../common/collections");
const dmm = require("../common/decimillimeter");
const mongo = require("../common/mongo.js");

/**
 * creates a new stat object with the specified name and value
 * @param {String} p_stat - string containing the name of the stat
 * @param {Number} p_value - number containing the value of the stat
 * @returns {Object} newly created stat object with the specified name and value
 */
function createStatObject(p_stat, p_value){
    let output = {
        stat : p_stat,
        value : p_value
    };
    return output;
}

/**
 * creates a new stat object in the COLLECTIONS.HEIGHT_STATS if it does not exist already
 * @param {Object} p_record - stat object obtained by `createStatObject()`
 * @returns {Object} object returned by the `.insertOne()` function
 */
async function createRecord(p_record){
    try{
        let collection = await mongo.getCollection(COLLECTIONS.HEIGHT_STATS);
        /** only create the record if the record doesn't exist already since updateRecord can be used to edit existing records and we want to avoid duplicate entries */
        let result_array = await collection.find({"stat" : p_record.stat}).toArray();
        if(result_array.length > 0){
            throw "[height_stats.js]: error creating record: " + p_record + "; record already exists;";
        }
        return await collection.insertOne(p_record);
    }
    catch(error){
        throw error;
    }
}

/**
 * retreives all the stat objects in the COLLECTIONS.HEIGHT_STATS
 * @returns {Array(Object)} returned by the `.find().toArray()` function
 */
async function readAllRecords(){
    try{
        let collection = await mongo.getCollection(COLLECTIONS.HEIGHT_STATS);
        return await collection.find({}).toArray();
    }
    catch(error){
        throw error;
    }
}

/**
 * retreives the stat object with the specified name in the COLLECTIONS.HEIGHT_STATS
 * @param {String} p_stat - string containing the name of the stat
 * @returns {Array(Object)} returned by the `.find().toArray()` function
 */
async function readRecords(p_stat){
    try{
        let collection = await mongo.getCollection(COLLECTIONS.HEIGHT_STATS);
        return await collection.find({"stat" : p_stat}).toArray();
    }
    catch(error){
        throw error;
    }
}

/**
 * updates a stat object with the specified name with the new stat object in the COLLECTIONS.HEIGHT_STATS
 * @param {String} p_stat - string containing the name of the stat object to be updated
 * @param {Object} p_value - updated value
 * @returns {Object} returned by the `.updateOne()` function
 */
async function updateRecord(p_stat, p_value){
    try{
        let collection = await mongo.getCollection(COLLECTIONS.HEIGHT_STATS);
        return await collection.updateOne({"stat" : p_stat}, {$set : {"stat" : p_stat, "value" : p_value}});
    }
    catch(error){
        throw error;
    }
}

/**
 * deletes a stat object with the specified name in the COLLECTIONS.HEIGHT_STATS
 * @param {String} p_stat - string containing the name of the stat object to be deleted
 * @returns {Object} returned by the `.deleteOne()` function
 */
async function deleteRecord(p_stat){
    try{
        let collection = await mongo.getCollection(COLLECTIONS.HEIGHT_STATS);
        return await collection.deleteOne({"stat" : p_stat});
    }
    catch(error){
        throw error;
    }
}


/**
 * generates statistics from the data in COLLECTIONS.HEIGHTS and saves the results in COLLECTIONS.HEIGHT_STATS
 * @returns {Object} returned by the `.insertMany()` function
 */
async function generateStatistics(){
    try{
        /** declare statistical variables to prepare for calculation */
        let sum_male_dmm = 0;
        let sum_female_dmm= 0;
        let n_male = 0;
        let n_female = 0;
        let min_male_dmm = Number.MAX_VALUE;
        let min_female_dmm = Number.MAX_VALUE;
        let max_male_dmm = 0;
        let max_female_dmm = 0;

        /**
         * get the collection handler for COLLECTIONS.HEIGHTS
         * retreive all the records from that collection
         * and loop through each record
         */
        let heights_collection = await mongo.getCollection(COLLECTIONS.HEIGHTS);
        let heights_all = await heights_collection.find({}).toArray();
        for(i = 0; i < heights_all.length; i++){
            /**
             * for each record in COLLECTIONS.HEIGHTS
             * obtain the height in decimillimeters for easy accessing
             */
            let male_dmm = heights_all[i].male;
            let female_dmm = heights_all[i].female;

            /** record sums for both male and female in (dmm) */
            sum_male_dmm += male_dmm;
            sum_female_dmm += female_dmm;

            /** record the counts for each heights entry, ignore if the height value is null*/
            n_male += (male_dmm == 0)? 0 : 1;
            n_female += (female_dmm == 0)? 0 : 1;

            /** record minimum values for male and female (dmm) */
            min_male_dmm = (male_dmm < min_male_dmm)? male_dmm : min_male_dmm;
            min_female_dmm = (female_dmm < min_female_dmm)? female_dmm : min_female_dmm;

            /** likewise for maximum values (dmm) */
            max_male_dmm = (male_dmm > max_male_dmm)? male_dmm : max_male_dmm;
            max_female_dmm = (female_dmm > max_female_dmm)? female_dmm : max_female_dmm;
        }

        /** 
         * calculate mean heights for both male and female in (dmm) 
         * we round to an integer to discard precision smaller than (dmm)
         */
        let mean_male_dmm = Math.round(sum_male_dmm / n_male);
        let mean_female_dmm = Math.round(sum_female_dmm / n_female);

        /** calculate the range for both male and female in (dmm) */
        let range_male_dmm = max_male_dmm - min_male_dmm;
        let range_female_dmm = max_female_dmm - min_female_dmm;

        /**
         * second pass,
         * calculate variance and standard deviation
         */
        let sum_squared_difference_of_mean_male_dmm = 0;
        let sum_squared_difference_of_mean_female_dmm = 0;
        for(i = 0; i < heights_all.length; i++){
            let male_dmm = heights_all[i].male;
            let female_dmm = heights_all[i].female;

            sum_squared_difference_of_mean_male_dmm += ((mean_male_dmm - male_dmm) * (mean_male_dmm - male_dmm));
            sum_squared_difference_of_mean_female_dmm += ((mean_female_dmm - female_dmm) * (mean_female_dmm - female_dmm));
        }
        /**
         * rounding the result since we're only interested in the results in cm, while storing in dmm
         */
        let variance_male_dmm = Math.round(sum_squared_difference_of_mean_male_dmm / n_male);
        let variance_female_dmm = Math.round(sum_squared_difference_of_mean_female_dmm / n_female);
        let standard_deviation_male_dmm = Math.round(Math.sqrt(variance_male_dmm))
        let standard_deviation_female_dmm = Math.round(Math.sqrt(variance_female_dmm));

        /**
         * now that we have our statistical data, we can create the array of stat objects to insert into our COLLECTIONS.HEIGHT_STATS
         */
        let stats = [];
        stats.push(createStatObject("sum_male_dmm", sum_male_dmm));
        stats.push(createStatObject("sum_female_dmm", sum_female_dmm));
        stats.push(createStatObject("n_male", n_male));
        stats.push(createStatObject("n_female", n_female));
        stats.push(createStatObject("mean_male_dmm", mean_male_dmm));
        stats.push(createStatObject("mean_female_dmm", mean_female_dmm));
        stats.push(createStatObject("min_male_dmm", min_male_dmm));
        stats.push(createStatObject("min_female_dmm", min_female_dmm));
        stats.push(createStatObject("max_male_dmm", max_male_dmm));
        stats.push(createStatObject("max_female_dmm", max_female_dmm));
        stats.push(createStatObject("range_male_dmm", range_male_dmm));
        stats.push(createStatObject("range_female_dmm", range_female_dmm));
        stats.push(createStatObject("variance_male_dmm", variance_male_dmm));
        stats.push(createStatObject("variance_female_dmm", variance_female_dmm));
        stats.push(createStatObject("standard_deviation_male_dmm", standard_deviation_male_dmm));
        stats.push(createStatObject("standard_deviation_female_dmm", standard_deviation_female_dmm));


        /**
         * retreive the collection handler for COLLECTIONS.HEIGHT_STATS
         * clear the collection before inserting the new values
         * insert the array of stat objects containing the statistical data and return the result object associated with `.insertMany()`
         */
        let height_stats_collection = await mongo.getCollection(COLLECTIONS.HEIGHT_STATS);
        await height_stats_collection.deleteMany({});
        return await height_stats_collection.insertMany(stats);
    }
    catch(error){
        throw error
    }
}

/**
 * calculates the percentile of the record according to the name and sex amongst the dataset
 * @param {String} p_name - name of the record to get the percentile of
 * @param {String} p_sex - male or female
 * @returns {Number} the calculated percentile value
 */
async function getPercentile(p_name, p_sex){
    /** generate sorting query to rank the `heights_all` array */
    let sort_query = {};
    if(p_sex === "male"){
        sort_query = {"male" : -1};
    }
    else if(p_sex === "female"){
        sort_query = {"female" : -1};
    }
    else {
        sort_query = {"name" : -1};
    }

    /** retrieve number of records below matching record */
    let heights_collection = await mongo.getCollection(COLLECTIONS.HEIGHTS);
    let heights_all = await heights_collection.find({}).sort(sort_query).toArray();
    let index = -1;
    let n_below_index = 0;
    for(i = 0; i < heights_all.length; i++){
        if(index != -1){
            /** matching record found, now we can count the number of records below it */
            n_below_index++;
        }
        else {
            /** matching record not found yet, keep looking for it */
            if(heights_all[i].name === p_name){
                /** found the record that matches */
                index = i;
            }
        }
    }

    /** calculate percentile from ordinal rank */
    let total_records = heights_all.length;
    return (n_below_index / total_records) * 100;
}

module.exports = {getPercentile, createStatObject, createRecord, readAllRecords, readRecords, updateRecord, deleteRecord, generateStatistics};
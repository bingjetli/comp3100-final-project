/**
 * middleware to connect, disconnect and access mongodb database
 * 
 * setup mongodb
 * specify the database url
 * and obtain the handler for the mongo client for this database instance
 */
const mongodb = require("mongodb");
const database_url = "mongodb://localhost:27017";
const mongo_client = new mongodb.MongoClient(database_url, {useUnifiedTopology : true});
let db;

/**
 * wrapper to connect to the specified mongodb database
 * @param {String} database_name - name of the database to connect to
 * @returns {Boolean} true if it successfully connected to the database
 */
async function connectToDatabase(database_name){
    try {
        await mongo_client.connect();
        db = await mongo_client.db(database_name);
        return true;
    }
    catch(error){
        throw error;
    }
}

/**
 * @returns the handler to the current database instance
 */
async function getDatabase(){
    return db;
}

/**
 * 
 * @param {String} collection_name - name of the collection to retrieve
 * @returns the handler to the current database instance's collection specified
 */
async function getCollection(collection_name){
    try{
        return await db.collection(collection_name);
    }
    catch(error){
        throw error;
    }
}

/**
 * wrapper to close the connection to the specified mongodb database
 * @returns {Boolean} true if it successfully closes the database instance
 */
async function closeDatabase(){
    try {
        await mongo_client.close();
        return true;
    }
    catch(error){
        throw error;
    }
}

module.exports = {connectToDatabase, getDatabase, getCollection, closeDatabase};
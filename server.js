/** 
 * setup express 
 * and obtain the handler for the express app
 */
const express = require("express");
const app = express();

/**
 * configure our express app to support json encoded bodies
 */
app.use(express.json());

/**
 * import our mongodb middleware
 */
const mongo = require("./utils/database.js");

/**
 * wrapper function to start the server so we can use callback detection on SIGINTerrupt to cleanly exit from mongodb
 */
let server;
async function startServer(){
    try{
        /**
         * attempt to connect to the specified mongo database instance
         */
        await mongo.connectToDatabase("country-heights-db");
        console.log("successfully connected to mongoDB");

        /** 
         * import our default controller
         * and setup corresponding route handlers
         */
        const default_controller = require("./controllers/default");
        app.get("/", default_controller.default_route);
        app.get("/dataset/all", default_controller.read_all_route);
        app.put("/dataset/create/:name/:male/:female", default_controller.create_route); //we use PUT for idempotency, to mitigate duplicate records of the same data being created
        app.delete("/dataset/delete/:name", default_controller.delete_route);

        /** begin express server listening on port 7777 */
        server = app.listen(7777, () => console.log("Server Started"));
    }
    catch(error){
        console.error(error);
    }
}
startServer();

/**
 * callback to detect interruptions to the server allowing mongodb to cleanly exit
 */
process.on('SIGINT', () => {
    console.log("server signal interrupted");
    server.close( async () => {
        try {
            await mongo.closeDatabase();
            console.log("successfully disconnected from mongoDB");
        }
        catch(error){
            console.error(error);
        }
    });
});
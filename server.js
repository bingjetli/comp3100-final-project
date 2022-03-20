/** 
 * setup express 
 * and obtain the handler for the express app
 */
const express = require("express");
const app = express();

/** import our mongodb wrapper module */
const mongo = require("./common/mongo.js");

/** configure our express app to support json encoded bodies */
app.use(express.json());

/** wrapper function to start the server so we can use callback detection on SIGINTerrupt to cleanly exit from mongodb */
let server;
async function startServer(){
    try{
        /** attempt to connect to the specified mongo database instance */
        await mongo.connectToDatabase("country-heights-db");
        console.log("successfully connected to mongoDB");

        /** 
         * import our controllers
         * and setup corresponding route handlers
         */
        const dataset_controller = require("./controllers/dataset");
        const statistics_controller = require("./controllers/statistics");
        app.get("/", (request, response) => {response.send("root route working!")});
        app.get("/dataset/reset", dataset_controller.reset_database_route);
        app.get("/dataset/get/:name", dataset_controller.read_route);
        app.post("/dataset/get", dataset_controller.read_ex_route);
        app.post("/dataset/new", dataset_controller.create_route);
        app.put("/dataset/update", dataset_controller.update_route);
        app.delete("/dataset/delete/:name", dataset_controller.delete_route);
        app.put("/statistics/generate", statistics_controller.generate_statistics_route);
        app.get("/statistics/all", statistics_controller.read_all_route);
        app.get("/statistics/read/:stat", statistics_controller.read_route);
        app.get("/statistics/percentile/:name/:sex", statistics_controller.get_percentile_route);

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
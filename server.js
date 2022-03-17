/** 
 * setup express 
 * and obtain the handler for the express app
 */
const express = require("express");
const app = express();

/** 
 * import our root router
 * and tell our application to use this router
 */
const root_router = require("./routes/root");
app.use("/", root_router);

/** begin express server listening on port 7777 */
app.listen(7777, () => console.log("Server Started"));
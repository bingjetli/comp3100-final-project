/** root route
 * 
 * import express
 * and obtain handler for the express router
 */
const express = require("express");
const router = express.Router();

/** verify that the root route is working by sending a response */
router.get("/", (request, response) => {
    response.send("Root Route working perfectly!");
});

/** export this router so we can actually use it when we import it into the main application using `require()` */
module.exports = router;
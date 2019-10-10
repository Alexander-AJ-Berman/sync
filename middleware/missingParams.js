
/**
 * Checks request body for the required parameters 
 */
const missingParams = (req, res, required) => {
    const missing = required;
    // Sanitize input
    if (req.body == undefined) {
        return res.status(400).send({message: `Enter parameters in the request body!`});
    }
    // Loop through body params, ensure all required
    for (const param in req.body) {
        if (missing.includes(param)) {
            // Remove correct param from missing list
            missing.splice(missing.indexOf(param), 1);
        }
    }

    if (missing.length != 0) {
        return res.status(400).send({message: `Missing the following required parameters: [${missing}]`});
    }
    return false;
}

module.exports = missingParams;
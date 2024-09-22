/**
 * This is The Helper For Handle Request and Response
 */

const handle = {};

handle.handleReqRes = (req, res) => {
    res.end("Hello Suckers");
}

module.exports = handle;
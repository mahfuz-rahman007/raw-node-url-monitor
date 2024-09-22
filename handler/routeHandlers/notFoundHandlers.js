/**
 * Not Found Handler
 */

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {

    callback(404, {
        message: "Your Requested url was not found"
    });

}

module.exports = handler;
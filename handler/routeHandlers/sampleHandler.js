/**
 * A Sample Handler
 */

const handler = {};

handler.sampleHandler = (requestProperties, callback) => {

    callback(200, {
        message: "This is from sample Response"
    });

}

module.exports = handler;
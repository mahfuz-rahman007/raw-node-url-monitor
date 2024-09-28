/**
 * A Token Handler
 */

const data = require("../../lib/data");

const handler = {};

handler.tokenHandler = (requestProperties, response) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, response);
  } else {
    response(405, {
      message: "Invalid Http Method!!",
    });
  }
};

handler._token = {};

// Post method
handler._token.post = (requestProperties, response) => {};

// Get method
handler._token.get = (requestProperties, response) => {};

// Put method
handler._token.put = (requestProperties, response) => {};

// Delete method
handler._token.delete = (requestProperties, response) => {};

module.exports = handler;

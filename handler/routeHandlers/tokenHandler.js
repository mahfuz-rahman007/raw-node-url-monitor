/**
 * A Token Handler
 */

const data = require("../../lib/data");
const {
  parseJSON,
  hash,
  createRandomToken,
} = require("../../helpers/utilities");

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
handler._token.post = (requestProperties, response) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      if (!err1) {
        if (hash(password) === parseJSON(userData).password) {
          let tokenId = createRandomToken(20);
          let expires = Date.now() + 60 * 60 * 1000;

          let tokenObj = {
            phone,
            tokenId,
            expires,
          };

          data.create("tokens", tokenId, tokenObj, (err2) => {
            if (!err2) {
              response(200, tokenObj);
            } else {
              response(500, {
                error: "Token Creating Failed",
              });
            }
          });
        } else {
          response(500, {
            error: "Password didn't match",
          });
        }
      } else {
        response(500, {
          error: "There is an error in Server",
        });
      }
    });
  } else {
    response(404, {
      error: "User Not Found",
    });
  }
};

// Get method
handler._token.get = (requestProperties, response) => {
  const tokenId = requestProperties.queryObject.get("id");

  if (tokenId && tokenId.length === 20) {
    data.read("tokens", tokenId, (err1, tokenData) => {
      if (!err1 && tokenData) {
        let parseTokenData = parseJSON(tokenData);

        response(200, parseTokenData);
      } else {
        response(404, {
          error: "Token in not Valid",
        });
      }
    });
  } else {
    response(404, {
      error: "Token in not Valid",
    });
  }
};

// Put method
handler._token.put = (requestProperties, response) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err1, tokenData) => {

      if (!err1 && tokenData) {

        if(parseJSON(tokenData).expires < Date.now()) {
            response(404, {
                error: "Token Already Expired",
              });
        }

        let parseTokenData = parseJSON(tokenData);

        parseTokenData.expires = Date.now() + 60*60*1000;

        data.update("tokens", id, parseTokenData, (err2) => {
          if (!err2) {
            response(200, {
              message: "Token Extended Successfully",
            });
          } else {
            response(500, {
              error: "Could not Extend Token",
            });
          }
        });

      } else {
        response(404, {
          error: "Token Not Found",
        });
      }
    });

  } else {
    response(400, {
      error: "Error in the request",
    });
  }
};

// Delete method
handler._token.delete = (requestProperties, response) => {

    const tokenId = requestProperties.queryObject.get("id");

    if (tokenId && tokenId.length === 20) {
  
      data.read("tokens", tokenId, (err1) => {
  
        if (!err1) {
  
          data.delete('tokens', tokenId, (err2) => {

            if(!err2) {
                response(200, {
                    error: "Token Deleted Successfully",
                  });
            } else {
                response(500, {
                    error: "Token Deleting Failed",
                  });
            }

          })
  
        } else {
          response(404, {
            error: "Token Not Found",
          });
        }
  
      });
  
    } else {
      response(400, {
        error: "Error in The Request",
      });
    }

};

// Verify Token
handler._token.verify = (phone, token, callback) => {
   
    data.read('tokens', token, (err, tokenData) => {
        if(!err) {
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}

module.exports = handler;

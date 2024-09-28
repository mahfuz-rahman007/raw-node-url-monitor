/**
 * A Token Handler
 */

const data = require("../../lib/data");
const { parseJSON, hash, createRandomToken } = require("../../helpers/utilities");

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

    
    if(phone && password) {

        data.read('users', phone, (err1, userData) => {

            if(!err1) {

                if(hash(password) === parseJSON(userData).password) {

                    let tokenId = createRandomToken(20);
                    let expires = Date.now() + 60*60*1000;

                    let tokenObj = {
                        phone,
                        tokenId,
                        expires
                    };

                    data.create('tokens', tokenId, tokenObj, (err2) => {

                        if(!err2) {
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

        })

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
handler._token.put = (requestProperties, response) => {};

// Delete method
handler._token.delete = (requestProperties, response) => {};

module.exports = handler;

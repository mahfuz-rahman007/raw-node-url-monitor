/**
 * A User Handler
 */

const data = require("../../lib/data");
const { _token } = require("./tokenHandler");
const { parseJSON, createRandomToken } = require("../../helpers/utilities");
const { maxChecks } = require("../../helpers/environments");

const handler = {};

handler.checkHandler = (requestProperties, response) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, response);
  } else {
    response(405, {
      message: "Invalid Http Method!!",
    });
  }
};

handler._check = {};

// Post method
handler._check.post = (requestProperties, response) => {
  // validate inputs
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (protocol && url && method && successCodes && timeOutSeconds) {
    const token =
      typeof requestProperties.headers.token === "string"
        ? requestProperties.headers.token
        : false;

    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const userPhone = parseJSON(tokenData).phone;
        // lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            _token.verify(userPhone, token, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObject = parseJSON(userData);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  const checkId = createRandomToken(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about the new check
                          response(200, checkObject);
                        } else {
                          response(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      response(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  response(401, {
                    error: "User has already reached max check limit!",
                  });
                }
              } else {
                response(403, { error: "Authentication problem!" });
              }
            });
          } else {
            response(403, { error: "User not found!" });
          }
        });
      } else {
        response(403, { error: "Authentication problem!" });
      }
    });
  } else {
    response(400, { error: "You have a problem in your request" });
  }
};

// Get method
handler._check.get = (requestProperties, response) => {
  const checkId = requestProperties.queryObject.get("id");

  if (checkId && checkId.length === 20) {
    data.read("checks", checkId, (err1, checkData) => {
      if (!err1 && checkData) {
        let parseCheckData = parseJSON(checkData);

        const token =
        typeof requestProperties.headers.token === "string"
          ? requestProperties.headers.token
          : false;

      _token.verify(parseCheckData.userPhone, token, (tokenVerify) => {
        if (tokenVerify) {
            response(200, parseCheckData);
        } else {
          response(403, {
            message: "You are not Authentication",
          });
        }
      });

      } else {
        response(404, {
          error: "Check Id in not Valid",
        });
      }

    });
  } else {
    response(400, {
      error: "You have a problem in your request",
    });
  }
};


handler._check.put = (requestProperties, response) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    // validate inputs
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeOutSeconds =
        typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds >= 1 &&
        requestProperties.body.timeOutSeconds <= 5
            ? requestProperties.body.timeOutSeconds
            : false;

    if (id) {
        if (protocol || url || method || successCodes || timeOutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObject = parseJSON(checkData);
                    const token =
                        typeof requestProperties.headers.token === 'string'
                            ? requestProperties.headers.token
                            : false;

                    _token.verify(checkObject.userPhone, token, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if (timeOutSeconds) {
                                checkObject.timeOutSeconds = timeOutSeconds;
                            }
                            // store the checkObject
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    response(200);
                                } else {
                                    response(500, {
                                        error: 'There was a server side error!',
                                    });
                                }
                            });
                        } else {
                            response(403, {
                                error: 'Authentication error!',
                            });
                        }
                    });
                } else {
                    response(500, {
                        error: 'There was a problem in the server side!',
                    });
                }
            });
        } else {
            response(400, {
                error: 'You must provide at least one field to update!',
            });
        }
    } else {
        response(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler._check.delete = (requestProperties, response) => {
    const id = requestProperties.queryObject.get("id");

    if (id && id.length === 20) {
        // lookup the check
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {
                const token =
                    typeof requestProperties.headers.token === 'string'
                        ? requestProperties.headers.token
                        : false;

                _token.verify(
                    parseJSON(checkData).userPhone,
                    token,
                    (tokenIsValid) => {
                        if (tokenIsValid) {
                            // delete the check data
                            data.delete('checks', id, (err2) => {
                                if (!err2) {
                                    data.read(
                                        'users',
                                        parseJSON(checkData).userPhone,
                                        (err3, userData) => {
                                            const userObject = parseJSON(userData);
                                            if (!err3 && userData) {
                                                const userChecks =
                                                    typeof userObject.checks === 'object' &&
                                                    userObject.checks instanceof Array
                                                        ? userObject.checks
                                                        : [];

                                                const checkPosition = userChecks.indexOf(id);
                                                if (checkPosition > -1) {
                                                    userChecks.splice(checkPosition, 1);
                                                    // resave the user data
                                                    userObject.checks = userChecks;
                                                    data.update(
                                                        'users',
                                                        userObject.phone,
                                                        userObject,
                                                        (err4) => {
                                                            if (!err4) {
                                                                response(200);
                                                            } else {
                                                                response(500, {
                                                                    error:
                                                                        'There was a server side problem!',
                                                                });
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    response(500, {
                                                        error:
                                                            'The check id that you are trying to remove is not found in user!',
                                                    });
                                                }
                                            } else {
                                                response(500, {
                                                    error: 'There was a server side problem!',
                                                });
                                            }
                                        }
                                    );
                                } else {
                                    response(500, {
                                        error: 'There was a server side problem!',
                                    });
                                }
                            });
                        } else {
                            response(403, {
                                error: 'Authentication failure!',
                            });
                        }
                    }
                );
            } else {
                response(500, {
                    error: 'You have a problem in your request',
                });
            }
        });
    } else {
        response(400, {
            error: 'You have a problem in your request',
        });
    }
};


module.exports = handler;

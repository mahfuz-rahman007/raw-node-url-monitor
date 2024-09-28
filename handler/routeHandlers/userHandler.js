/**
 * A User Handler
 */

const data = require("../../lib/data");
const { _token } = require("./tokenHandler");
const { parseJSON, hash } = require("../../helpers/utilities");

const handler = {};

handler.userHandler = (requestProperties, response) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, response);
  } else {
    response(405, {
      message: "Invalid Http Method!!",
    });
  }
};

handler._users = {};

// Post method
handler._users.post = (requestProperties, response) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that user does not already exist
    data.read("users", phone, (err1) => {
      if (err1) {
        let userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        data.create("users", phone, userObj, (err2) => {
          if (!err2) {
            response(200, {
              message: "User created successfully!",
            });
          } else {
            response(500, {
              error: "Could not create user",
            });
          }
        });
      } else {
        response(500, {
          error: "User Already Exits with the Phone Number",
        });
      }
    });
  } else {
    response(400, {
      error: "Your have problem in your request",
    });
  }
};

// Get method
handler._users.get = (requestProperties, response) => {
  const phone = requestProperties.queryObject.get("phone");

  if (phone && phone.length === 11) {
    const token =
      typeof requestProperties.headers.token === "string"
        ? requestProperties.headers.token
        : false;

    _token.verify(phone, token, (tokenVerify) => {
      if (tokenVerify) {
        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            let parseUserData = parseJSON(userData);
            delete parseUserData.password;
            response(200, parseUserData);
          } else {
            response(404, {
              error: "User Not Found With This Phone",
            });
          }
        });
      } else {
        response(403, {
          message: "You are not Authentication",
        });
      }
    });
  } else {
    response(404, {
      error: "User Not Found",
    });
  }
};

// Put method
handler._users.put = (requestProperties, response) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    const token =
      typeof requestProperties.headers.token === "string"
        ? requestProperties.headers.token
        : false;

    _token.verify(phone, token, (tokenVerify) => {
      if (tokenVerify) {
        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            let parseUserData = parseJSON(userData);

            if (firstName) {
              parseUserData.firstName = firstName;
            }

            if (lastName) {
              parseUserData.lastName = lastName;
            }

            if (password) {
              parseUserData.password = hash(password);
            }

            data.update("users", phone, parseUserData, (err2) => {
              if (!err2) {
                response(200, {
                  message: "User updated successfully!",
                });
              } else {
                response(500, {
                  error: "Could not update user",
                });
              }
            });
          } else {
            response(404, {
              error: "User Not Found",
            });
          }
        });
      } else {
        response(403, {
          message: "You are not Authentication",
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
handler._users.delete = (requestProperties, response) => {
  const phone = requestProperties.queryObject.get("phone");

  if (phone && phone.length === 11) {

    const token =
      typeof requestProperties.headers.token === "string"
        ? requestProperties.headers.token
        : false;

    _token.verify(phone, token, (tokenVerify) => {
      if (tokenVerify) {
        data.read("users", phone, (err1, userData) => {
          if (!err1 && userData) {
            data.delete("users", phone, (err2) => {
              if (!err2) {
                response(200, {
                  error: "User Deleted Successfully",
                });
              } else {
                response(500, {
                  error: "User Deleting Failed",
                });
              }
            });
          } else {
            response(404, {
              error: "User Not Found",
            });
          }
        });
      } else {
        response(403, {
          message: "You are not Authentication",
        });
      }
    });
  } else {
    response(400, {
      error: "Error in The Request",
    });
  }
};

module.exports = handler;

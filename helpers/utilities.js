/**
 * Utilities Function
 */

const crypto = require("crypto");
const environment = require('./environments');

const utilities = {};

// Parse Json string to object
utilities.parseJSON = (jsonString) => {
  let output = {};

  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (string) => {
  if (typeof string === "string" && string.length > 0) {

    let hash = crypto
      .createHash("sha256", environment.secretKey)
      .update(string)
      .digest("hex");

      return hash;

  } else {
    return false;
  }
};

module.exports = utilities;

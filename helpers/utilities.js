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

utilities.createRandomToken = (length) => {
  const character = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let output = '';

  for (let index = 0; index < length; index++) {
    const randomChar = character.charAt(Math.floor(Math.random() * character.length));
    output += randomChar;
  }

  return output;
}

module.exports = utilities;

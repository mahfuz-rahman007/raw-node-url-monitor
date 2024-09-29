/**
 * Environments Keys
 */

// environment module scaffolding
const environments = {};

// staging environment
environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: 'gradsgreqarsfsad',
  maxChecks: 5
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: 'dhdtjearhrdhfhsd',
  maxChecks: 5
};

// Determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// Export Default Module
module.exports = environmentToExport;

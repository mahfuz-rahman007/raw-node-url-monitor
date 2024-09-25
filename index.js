/**
 * A Raw Node Js Project To Monitor URl Uptime
 * Project From Sumit Saha
 */

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// Main Module - Scaffolding
const app = {};

// Create Server
app.createServer = () => {

    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`Server Running on port ${environment.port}`);
    })
}

app.handleReqRes = handleReqRes;

app.createServer();
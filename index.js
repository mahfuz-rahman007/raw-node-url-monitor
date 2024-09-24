/**
 * A Raw Node Js Project To Monitor URl Uptime
 * Project From Sumit Saha
 */

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

// Main Module - Scaffolding
const app = {};

// Create Server
app.createServer = () => {

    const server = http.createServer(app.handleReqRes);

    server.listen(app.config.port, () => {
        console.log(`Environment Variable  ${process.env.N} ${process.env.M}`);
        console.log(`Server Running on port ${environment.config.port}`);
    })
}

app.handleReqRes = handleReqRes;

app.createServer();
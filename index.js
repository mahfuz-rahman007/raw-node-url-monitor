/**
 * A Raw Node Js Project To Monitor URl Uptime
 * Project From Sumit Saha
 */

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

// Main Module - Scaffolding
const app = {};

// Add Configuration
app.config = {
    port: 3000
}


// Create Server
app.createServer = () => {

    const server = http.createServer(app.handleReqRes);

    server.listen(app.config.port, () => {
        console.log(`Server Running on port ${app.config.port}`)
    })
}

app.handleReqRes = handleReqRes;

app.createServer();
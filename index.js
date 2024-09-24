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

// For testing
data.create('test', 'test-data', {"name": 'Mahfujur Rahman', "age" : 22}, (err) => {
    console.log("File Write " + err);
});

data.read('test', 'test-data', (err,result) => {
    console.log(err, result);
});

data.update('test', 'test-data', {"name": 'Hasan Rahman', "age" : 30}, (err) => {
    console.log("File Write " + err);
});

data.delete('test', 'test-data', (err) => {
        console.log(err);
});

// Create Server
app.createServer = () => {

    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`Server Running on port ${environment.port}`);
    })
}

app.handleReqRes = handleReqRes;

app.createServer();
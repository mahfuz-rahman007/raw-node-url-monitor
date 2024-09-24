/**
 * This is The Helper For Handle Request and Response
 */

// Dependencies
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundHandler} = require('../handler/routeHandlers/notFoundHandlers');

const handle = {};

handle.handleReqRes = (req, res) => {
    
    // Handle Request
    const baseURL =  req.protocol + '://' + req.headers.host + '/';
    const reqUrl = new URL(req.url,baseURL);
    
    const pathName = reqUrl.pathname;
    const trimmedPathName = pathName.replace(/^\/+|\/+$/g, '');
    const method = req.method;
    const queryObject = reqUrl.searchParams;
    const headers = req.headers;

    const requestProperties = {
        req,
        reqUrl,
        pathName,
        trimmedPathName,
        method,
        queryObject,
        headers
    }

    const decoder = new StringDecoder('utf-8');
    let data = '';

    const chosenHandler = routes[trimmedPathName] ? routes[trimmedPathName] : notFoundHandler;

    req.on('data', (buffer) => {
        data += decoder.write(buffer);
    })

    req.on('end', () => {
        data += decoder.end();

        chosenHandler(requestProperties, (statusCode, payload) => {

            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
            
            const payloadString = JSON.stringify(payload);
    
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        res.end("Hello Suckers");
    })
    
}

module.exports = handle;
/**
 * This is The Helper For Handle Request and Response
 */

// Dependencies
const { buffer } = require('stream/consumers');
const {StringDecoder} = require('string_decoder')

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

    req.on('data', (buffer) => {
        data += decoder.write(buffer);
    })

    req.on('end', () => {
        data += decoder.end();

        console.log(data);

        res.end("Hello Suckers");
    })
    
}

module.exports = handle;
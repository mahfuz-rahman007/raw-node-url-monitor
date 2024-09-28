/**
 * Routes For All Js Incoming Request
 */

const {sampleHandler} = require('./handler/routeHandlers/sampleHandler');
const {userHandler} = require('./handler/routeHandlers/userHandler');

const routes = {
    'sample' : sampleHandler,
    'user': userHandler,
    'token': tokenHandler
}

module.exports = routes;
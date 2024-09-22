/**
 * Routes For All Js Incoming Request
 */

const {sampleHandler} = require('./handler/routeHandlers/sampleHandler')

const routes = {
    'sample' : sampleHandler
}

module.exports = routes;
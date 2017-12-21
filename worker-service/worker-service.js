/**
 * @name Worker
 * @summary Worker Hydra Express service entry point
 * @description tests
 */
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');

let config = require('fwsp-config');

/**
 * Load configuration file and initialize hydraExpress app
 */
config.init('./config/config.json')
    .then(() => {
        config.version = version;
        return hydraExpress.init(config.getObject(), version, () => {
            hydraExpress.registerRoutes({
                '/v1/worker': require('./routes/worker-v1-routes')
            });
        });
    })
    .then(serviceInfo => console.log('serviceInfo', serviceInfo))
    .catch(err => console.log('err', err));
const path = require('path');
const serviceType = process.argv[2];
const config = require('./configs/config');


if (!serviceType) {
    throw new Error('No service type selected');
}
let service = require(path.resolve('services/' + serviceType));

service.init(config);
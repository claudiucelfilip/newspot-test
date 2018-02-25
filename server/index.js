const path = require('path');
const serviceType = process.argv[2];
const configType = process.argv[3] || 'config';
const config = require('./configs/' + configType);


if (!serviceType) {
    throw new Error('No service type selected');
}
let service = require(path.resolve('services/' + serviceType));

service.init(config);
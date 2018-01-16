const path = require('path');
const serviceType = process.argv[2];
if (!serviceType) {
    throw new Error('No service type selected');
}
let service = require(path.resolve('services/' + serviceType));

service.init();
const { WSPort } = require('./configs');
const WS = require('./src').WS;

const wsServer = new WS({ port: WSPort });
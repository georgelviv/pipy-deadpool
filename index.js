const { WSPort } = require('./configs');
const WS = require('./src').WS;

const wsServer = new WS({ port: WSPort, onClientConnection: onClientConnection });

function onClientConnection(connection) {
  connection.onMsg(message => {
    console.log(message)
    switch (message.type) {
      case 'response':
        console.log('latency:', Date.now() - (new Date(message.data.date).getTime()));
        console.log('data: ', message.data.data);
        break;
    }
  });

  // connection.sendMsg({
  //   type: 'request',
  //   data: 'get_dht_sensor_data'
  // });
}

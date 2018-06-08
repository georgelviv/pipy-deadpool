const { WSPort } = require('./configs');
const WS = require('./src').WS;
const getTimeDiff = require('./src/helpers').getTimeDiff;

class Deadpool {
  constructor(settings) {
    this.settings = settings;

    this.setupWsServer();
    this.connections = [];
  }

  setupWsServer() {
    const wsSettings = Object.assign({}, this.settings.ws, { 
      onClientConnection: this.onClientConnection.bind(this) 
    });
    this.wsServer = new WS(wsSettings);
  }

  sendTo(receiverName, msg) {
    const receiver = this.connections.find(connection => connection.name === receiverName);
    if (receiver) {
      receiver.sendMsg(msg);
    } else {
      this.log(`I dont have ${ receiverName }`);
    }
  }

  removeConnection(connectionName) {
    this.connections = this.connections.filter(connection => {
      return connection.name !== connectionName;
    });
  }

  onClientConnection(connection) {
    this.connections.push(connection);

    connection.onMsg(this.messageHandler.bind(this, connection));

    connection.onClose(() => {
      this.log(`connection from ${ connection.name }: closed connection`);
      this.removeConnection(connection.name);
    });
  }

  messageHandler(connection, message) {
    this.log(`received msg ${JSON.stringify(message)}`);
    switch (message.type) {
      case 'meta':
        return;
      case 'request':
      case 'response':
        if (message.to) {
          this.sendTo(message.to, message);
        } else {
          this.log('I dont know what to do with next message', message);
        }
        return;
      case 'test':
        connection.sendMsg({
          type: 'test',
          data: 'ok'
        });
    }
  }

  log(msg) {
    console.log(`WS Broker: ${ msg }`);
  }
  
}

new Deadpool({
  ws: { port: WSPort }
});



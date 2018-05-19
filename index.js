const { WSPort } = require('./configs');
const WS = require('./src').WS;


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
      console.log(`I dont have ${ receiverName }`);
    }
  }

  removeConnection(connectionName) {
    this.connections = this.connections.filter(connection => {
      return connection.name !== connectionName;
    });
  }

  onClientConnection(connection) {
    this.connections.push(connection);

    connection.onMsg(message => {
      console.log('received message from', message.from);
      if (message.to) {
        message.brokerDate = new Date();
        this.sendTo(message.to, message);
      } else {
        console.log('I dont know what to do with next message', message);
      }
    });

    connection.onClose(() => {
      console.log(`connection from ${ connection.name }: closed connection`);
      this.removeConnection(connection.name);
    });
  }
  
}

new Deadpool({
  ws: { port: WSPort }
});



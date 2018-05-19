class WSSConnection {
  constructor(connection) {
    this.connection = connection;
    
    connection.on('close', (reasonCode, description) => {
      console.log(`connection: ${ connection.remoteAddress }: closed connection`);
    });
  }

  onMsg(cb) {
    this.connection.on('message', (msg) => {
      const data = JSON.parse(msg.utf8Data);
      switch (data.type) {
        case 'meta':
          this.name = data.name;
          break;
        default:
          cb(data);
      }
    })
  }

  sendMsg(obj) {
    this.connection.sendUTF(JSON.stringify(obj));
  }
}

module.exports = WSSConnection;
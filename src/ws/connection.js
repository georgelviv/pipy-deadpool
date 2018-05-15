class WSSConnection {
  constructor(connection) {
    this.connection = connection;
    
    connection.on('close', (reasonCode, description) => {
      console.log(`connection: ${ connection.remoteAddress }: closed connection`);
    });
  }

  onMsg(cb) {
    this.connection.on('message', (msg) => {
      cb(JSON.parse(msg.utf8Data))
    })
  }

  sendMsg(obj) {
    console.log('sending msg');
    this.connection.sendUTF(JSON.stringify(obj));
  }
}

module.exports = WSSConnection;
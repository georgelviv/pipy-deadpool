const getTimeDiff = require('../helpers').getTimeDiff;

class WSSConnection {
  constructor(connection) {
    this.connection = connection;
  }

  onClose(cb) {
    this.connection.on('close', (reasonCode, description) => {
      cb(this);
    });
  }

  onMsg(cb) {
    this.connection.on('message', (msg) => {
      const data = JSON.parse(msg.utf8Data);
      switch (data.type) {
        case 'meta':
          this.name = data.name;
          break;
        case 'response':
          data.messageLatency = getTimeDiff(new Date(data.messageTime));
          delete data.messageTime;
      }
      cb(data);
    })
  }

  sendMsg(obj) {
    if (obj.type === 'request') {
      obj.date = new Date();
    }
    this.connection.sendUTF(JSON.stringify(obj));
  }
}

module.exports = WSSConnection;
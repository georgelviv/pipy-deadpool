const WebsocketServe = require('websocket').server;
const http = require('http');

class WS {

  static get defaultSettings() {
    return { 
      port: 8080
    }
  }
  
  constructor(settings) {
    this.connections = [];
    this.setSettings(settings);
    this.httpServer = this.createHTTPServer();
    this.wsServer = this.createWSServer();
  }

  addConnection(req) {
    const connection = req.accept('echo-protocol', req.origin);
    this.log(`client ${ connection.remoteAddress }: connected`);

    connection.on('close', (reasonCode, description) => {
      this.log(`client ${ connection.remoteAddress }: closed connection`);
    });

    connection.on('message', (message) => {
      console.log(message);
    });

    this.connections.push(connection);
  }

  setSettings(settings) {
    this.settings = Object.assign({}, WS.defaultSettings, settings);
  }

  createWSServer() {
    const wsServer = new WebsocketServe({
      httpServer: this.httpServer,
      // You should not use autoAcceptConnections for production
      // applications, as it defeats all standard cross-origin protection
      // facilities built into the protocol and the browser.  You should
      // *always* verify the connection's origin and decide whether or not
      // to accept it.
      autoAcceptConnections: false
    });

    wsServer.on('request', (req) => {

      this.addConnection(req);
    })

    return wsServer;
  }

  createHTTPServer() {
    const { port } = this.settings;
    const httpServer = http.createServer((req, res) => {
      this.log(`request ${ req.url }`)
      res.writeHead(404);
      res.end();
    });

    httpServer.listen(port, () => {
      this.log(`listen on ${ port }`);
    })

    return httpServer;
  }

  log(msg) {
    console.log(`wss server: ${ msg }`);
  }
}

module.exports = WS;
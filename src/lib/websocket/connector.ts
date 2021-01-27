import WebSocket from 'ws';

import { ErrorMessage } from './payloads/ErrorMessage';
import { RegisterClientAtService } from './payloads/PayloadType';
import { RegisterClient } from './payloads/RegisterClient';
import { ServiceMessage } from './payloads/ServiceMessage';

export class WebSocketConnector {
  private ws: WebSocket;
  private readonly name: string;
  private closing = false;
  private handlers = {
    error: null,
    message: null,
    file: null,
  };
  private connectionTimeout: NodeJS.Timeout;

  constructor(name: string) {
    this.name = name;
  }

  onError(func: (errorMessage: ErrorMessage) => void) {
    this.handlers.error = func;
    return this;
  }
  onMessage(func: (message: ServiceMessage) => void) {
    this.handlers.file = func;
    return this;
  }
  onFile(func: (message: ServiceMessage) => void) {
    this.handlers.file = func;
    return this;
  }

  close() {
    this.closing = true;
    if (this.ws) {
      this.ws.close();
    }
  }

  async connect(url: string) {
    this.closing = false;
    if (url.indexOf('ws://') !== 0) url = 'ws://' + url;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        let resolved = false;

        this.ws.on('open', () => {
          console.log('connection opened');
          this.register();
          resolved = true;
          resolve(this);
        });

        //timeout connection after 10 sec
        this.connectionTimeout = setTimeout(() => {
          if (!resolved) {
            reject('timeout');
          }
        }, 10000);

        this.ws.on('close', () => {
          console.log('Server closed WS connection');
          if (!this.closing) {
            this.tryReconnect(url);
          }
        });

        this.ws.on('error', (err) => {
          console.error('WS Error: ', err);
        });

        this.ws.on('unexpected-response', () => {
          console.error('WS unexp response');
        });

        this.ws.on('message', (data) => this.onMessageReceived(data));
      } catch (e) {
        console.log('there was an error', e);
        this.tryReconnect(url);
      }
    });
  }

  private register() {
    this.send(RegisterClientAtService, new RegisterClient(this.name));
  }

  private onMessageReceived(data: any) {
    try {
      const jsonObj = JSON.parse(data);
      if (jsonObj) {
        console.log('received message', jsonObj);

        /* handle keep alive client */
        if (jsonObj.keepAlive) {
          return this.ws.send(JSON.stringify({ keepAlive: true }));
        }

        /* handle error */
        if (ErrorMessage.isErrorMessage(jsonObj)) {
          if (this.handlers.error) {
            this.handlers.error(jsonObj);
          } else {
            console.error('UNHANDLED ERROR', jsonObj);
          }
          return;
        }

        /* handle message to client */
        if (ServiceMessage.isMessage(jsonObj)) {
          if (this.handlers.message) {
            this.handlers.message(jsonObj);
          } else {
            console.log('UNHANDLED MESSAGE', jsonObj);
          }
          return;
        }

        console.log('UNKNOWN MESSAGE TYPE', jsonObj);
      }
    } catch (e) {
      // console.error(e);
      console.error('unresolvable data from websocket: ', data);
    }
  }

  private tryReconnect(url) {
    console.log('reconnecting in a few seconds');
    clearTimeout(this.connectionTimeout);
    setTimeout(() => {
      this.connect(url).catch(() => {
        console.log('reconnect failed');
      });
    }, 3000);
  }

  private send(type: 'reg_client' | 'client_message', params: any) {
    this.ws.send(JSON.stringify(Object.assign({ type }, params)));
  }
}

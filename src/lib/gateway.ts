import axios from 'axios';
import request from 'request';

import BotRequest from './botRequest';
import BotResponse from './botResponse';
import { WebSocketConnector } from './websocket/connector';

export default class Gateway {
  private serviceId = 'GenericBot';
  websocketConnector: WebSocketConnector = null;

  constructor(gatewayUrl?: string, serviceId?: string) {
    axios.defaults.baseURL = gatewayUrl || 'http://localhost:3000';
    this.serviceId = serviceId ? serviceId : this.serviceId;
    BotRequest.serviceId = this.serviceId;
  }

  connectWebSocket = async () => {
    const url = axios.defaults.baseURL
      .replace('http://', '')
      .replace('https://', '');
    this.websocketConnector = new WebSocketConnector('discord');
    await this.websocketConnector.connect(url);
    return this.websocketConnector;
  };

  readonly query = async (message: BotRequest): Promise<BotResponse> => {
    message.computeValues(this.serviceId);
    const response = await axios.post('/message', message.payload);
    return Gateway.parseResponse(response.data);
  };

  readonly queryAudio = async (fileStream, fileName, mimeType): Promise<BotResponse> => {
    return new Promise((resolve, reject) => {
      const req = request.post(axios.defaults.baseURL + '/audio', function (err, _resp, body) {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
      const form = req.form();
      form.append('file', fileStream, {
        filename: fileName,
        contentType: mimeType
      });
    })
  };



  // readonly queryAudio = async (fileStream, fileName, mimeType){


    // request.post('http://localhost:3000/audio', function (err, resp, body) {
  //     if (err) {
  //       console.log('Error!');
  //     } else {
  //       console.log('URL: ' + body);
  //     }
  //   });
  //   var form = req.form();
  //   form.append('file', fileStream, {
  //   filename: fileName,
  //   contentType: mimeType
  // });
  // }


  private static parseResponse(jsonResponse?: string): BotResponse {
    return Object.assign(new BotResponse(), jsonResponse);
  }
}

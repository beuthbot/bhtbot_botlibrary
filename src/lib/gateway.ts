import axios from 'axios';

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

  private static parseResponse(jsonResponse?: string): BotResponse {
    return Object.assign(new BotResponse(), jsonResponse);
  }
}

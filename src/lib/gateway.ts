import axios from 'axios';

import BotRequest from './botRequest';
import BotResponse from './botResponse';

export default class Gateway {
  private serviceId = 'GenericBot';

  constructor(gatewayUrl?: string, serviceId?: string) {
    axios.defaults.baseURL = gatewayUrl || 'http://localhost:3000';
    this.serviceId = serviceId ?? this.serviceId;
    BotRequest.serviceId = this.serviceId;
  }

  readonly query = async (message: BotRequest): Promise<BotResponse> => {
    message.computeValues(this.serviceId);
    const response = await axios.post('/message', message.payload);
    return Gateway.parseResponse(response.data);
  };

  private static parseResponse(jsonResponse?: string): BotResponse {
    return Object.assign(new BotResponse(), jsonResponse);
  }
}

import axios from 'axios';

import BotRequest from './botRequest';
import BotResponse from './botResponse';

function parseResponse(jsonResponse?: string): BotResponse {
  return Object.assign(new BotResponse(), jsonResponse);
}

export default class Gateway {
  constructor(gatewayUrl?: string) {
    axios.defaults.baseURL = gatewayUrl || 'http://localhost:3000';
  }

  readonly query = async (message: BotRequest): Promise<BotResponse> => {
    const response = await axios.post('/message', message.payload);

    return parseResponse(response.data);
  };
}

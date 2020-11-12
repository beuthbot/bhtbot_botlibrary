import BotRequestPayload from './botRequestPayload';

export default class BotRequest {
  payload: BotRequestPayload;
  constructor(payload: BotRequestPayload) {
    if (
      payload === undefined ||
      payload === null ||
      payload.text === undefined ||
      payload.text === null
    ) {
      throw new Error('Payload must contain text');
    }
    this.payload = payload;
    console.log('Bot Request with payload', this.payload);
  }
}

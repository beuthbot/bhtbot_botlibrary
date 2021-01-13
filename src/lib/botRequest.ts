import BotRequestPayload from './botRequestPayload';

export default class BotRequest {
  payload: BotRequestPayload;
  static serviceId?: string;

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
    this.computeValues();
    console.log('Bot Request with payload', this.payload);
  }

  computeValues(serviceId?: string) {
    serviceId = serviceId ? serviceId : BotRequest.serviceId;
    this.payload.serviceName = serviceId;
  }

  setText(text: string) {
    this.payload.text = text;
    return this;
  }

  setUserId(userId: number | string) {
    if (userId.toString().indexOf('@') > 0) {
      //strip off service name if provided
      userId = userId.toString().split('@')[0];
    }
    this.payload.serviceUserId = userId;
    return this;
  }

  setClientLanguage(language: string) {
    this.payload.clientLanguage = language;
    return this;
  }

  setUserTime(clientDate: number) {
    this.payload.clientDate = clientDate;
    return this;
  }

  setUserFirstname(firstname) {
    this.payload.firstName = firstname;
    return this;
  }

  get userId() {
    return this.payload.serviceUserId + '@' + this.payload.serviceName;
  }
}

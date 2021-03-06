export default class BotRequestPayload {
  text: string;
  serviceName?: string;
  serviceUserId?: number | string;
  clientDate?: number;
  firstName?: string;
  clientLanguage?: string = 'de';
  constructor(message: string) {
    this.text = message;
  }
}

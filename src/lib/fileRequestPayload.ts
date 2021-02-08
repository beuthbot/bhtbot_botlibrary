import BotRequestPayload from './botRequestPayload';

export default class FileRequestPayload extends BotRequestPayload {
  fileStream: null;
  fileName: null;
  mimeType: null;

  constructor(serviceUserId) {
    super('');
    this.serviceUserId = serviceUserId;
  }
}

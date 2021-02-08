import BotRequest from './botRequest';
import FileRequestPayload from './fileRequestPayload';

export default class FileRequest {
  payload: FileRequestPayload;
  fileStream = null;
  fileName: string;
  mimeType: string;
  constructor(fileStream, fileName, mimeType, payload: FileRequestPayload) {
    if (!payload || !payload.serviceUserId) {
      throw new Error('Payload must contain userId');
    }
    this.fileStream = fileStream;
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.payload = payload;
    this.computeValues();
    console.log('Bot Request with payload', this.payload);
  }

  computeValues(serviceId?: string) {
    serviceId = serviceId ? serviceId : BotRequest.serviceId;
    this.payload.serviceName = serviceId;
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

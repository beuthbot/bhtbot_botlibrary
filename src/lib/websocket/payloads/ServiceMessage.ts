export class ServiceMessage {
  static type = 'message';
  userId: string;
  message: string;
  static isMessage(obj: any) {
    return obj && obj.type === ServiceMessage.type && obj.message && obj.userId;
  }
}

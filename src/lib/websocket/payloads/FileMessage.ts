export class FileMessage {
  static type = 'file';
  userId: string;
  fileName: string;
  binary: Buffer;

  static isFile(obj: any) {
    return (
      obj &&
      obj.type === FileMessage.type &&
      obj.fileName &&
      obj.userId &&
      obj.binary
    );
  }
}

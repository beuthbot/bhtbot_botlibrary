export class ErrorMessage {
  static type = 'error';
  static isErrorMessage(obj: any) {
    return obj && obj.error && obj.error !== '';
  }
}

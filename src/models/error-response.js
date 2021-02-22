export default class ErrorResponse {
  status: string;
  message: string;

  constructor(status, message?) {
    this.status = status;
    this.message = message;
  }
}

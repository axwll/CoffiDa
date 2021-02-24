export default class ValidatorResponse {
  status: Boolean;

  message: string;

  constructor(status, message?) {
    this.status = status;
    this.message = message;
  }
}

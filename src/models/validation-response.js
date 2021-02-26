/**
 * A Validation Response model used by the Validator
 * 'status'  => The status of the API response (true|false)
 * 'message' => The validation message to return
 *
 * (Models are usually used in typesctipt but I thought this could be useful here)
 */
export default class ValidatorResponse {
  status: Boolean;

  message: string;

  constructor(status, message?) {
    this.status = status;
    this.message = message;
  }
}

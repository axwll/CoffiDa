/**
 * An Error Response model used by the ErrorHandler
 * 'status'  => The status of the API response ("success"|"error")
 * 'message' => The message to return. Uses the codes.json files to decide the message.
 *
 * (Models are usually used in typesctipt but I thought this could be useful here)
 */
export default class ErrorResponse {
  status: string;

  message: string;

  constructor(status, message?) {
    this.status = status;
    this.message = message;
  }
}

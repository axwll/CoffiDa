import { Component } from 'react';

import ERROR_CODES from '../assets/data/error_codes.json';
import SUCCESS_CODES from '../assets/data/success_codes.json';
import ErrorResponse from '../models/error-response';
import toast from './toast';

/**
 * Class for handling Errors
 */
class ErrorHandler extends Component {
  /**
   * API Error function used when catching API Errors
   *
   * @param   {string}  url  The URL the request failed on
   * @param   {object}  err  The Error response from the API
   */
  apiError = (url, err) => {
    const error = JSON.stringify(err);
    this.log(
      `An error occoured during network request: ${url}. Error - ${error}`,
      'A network request failed.',
    );
  };

  /**
   * Uses the JSON arrays of success and error codes to determine the response message to give
   *
   * @param   {Integer}  statusCode  The response code from the API
   *
   * @return  {ErrorResponse}         The Error response Object Model
   */
  checkStatusCode = (statusCode) => {
    if (this.checkSuccess(statusCode)) {
      return new ErrorResponse('success');
    }

    const error = ERROR_CODES.find((item) => item.code === statusCode);

    let message = '';
    if (error) {
      message = error.message;
    } else {
      message = 'Unknown Error';
    }

    this.log(`Network request returned error: ${message}`, message);
    return new ErrorResponse('error', message);
  };

  /**
   * Checks if a given code is a success code
   *
   * @var {Integer} statusCode The status code from the API response
   */
  checkSuccess = (statusCode) => SUCCESS_CODES.some((item) => item.code === statusCode);

  /**
   * General logging function that does a toast and logs to the console
   *
   * @param   {string}  logMessage    The message to log to the console
   * @param   {string}  toastMessage  The message to show to the user
   */
  log = (logMessage, toastMessage) => {
    console.log(logMessage);
    toast(toastMessage);
  };
}

const errorHandler = new ErrorHandler();
export default errorHandler;

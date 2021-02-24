import { Component } from 'react';

import ERROR_CODES from '../assets/data/error_codes.json';
import SUCCESS_CODES from '../assets/data/success_codes.json';
import ErrorResponse from '../models/error-response';
import { toast } from './toast';

class ErrorHandler extends Component {
  apiError = (url, err) => {
    const error = JSON.stringify(err);
    this.log(
      `An error occoured during network request: ${url}. Error - ${error}`,
      'A network request failed.',
    );
  };

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

  checkSuccess = (statusCode) => SUCCESS_CODES.some((item) => item.code === statusCode);

  log = (logMessage, toastMessage) => {
    console.log(logMessage);
    toast(toastMessage);
  };
}

const errorHandler = new ErrorHandler();
export default errorHandler;

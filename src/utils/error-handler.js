import React, { Component } from 'react';

import ERROR_CODES from '../assets/data/error_codes.json';
import SUCCESS_CODES from '../assets/data/success_codes.json';
import { toast } from './toast';

interface Response {
  status: string;
  message?: string;
}

class ErrorHandler extends Component<Response> {
  apiError = (url, err) => {
    const error = JSON.stringify(err);
    this.log(
      `An error occoured during network request: ${url}. Error - ${error}`,
      'A network request failed.',
    );
  };

  checkStatusCode = (statusCode) => {
    SUCCESS_CODES.forEach((code) => {
      if (code === statusCode) {
        return new Response('success');
      }
    });

    let message = '';
    ERROR_CODES.forEach((code) => {
      if (code === statusCode) {
        message = code.message;
      } else {
        message = 'Unknown Error';
      }
    });

    this.log(`Network request returned error: ${message}`, message);
    return new Response('error', message);
  };

  log = (logMessage, toastMessage) => {
    console.log(logMessage);
    toast(toastMessage);
  };
}

const errorHandler = new ErrorHandler();
export default errorHandler;

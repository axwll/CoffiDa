import { Component } from 'react';

import ErrorHandler from './error-handler';

const API_URL = 'http://10.0.2.2:3333/api/1.0.0';

/**
 * API Request Utility handles all requests to the Web Service
 */
class ApiRequests extends Component {
  constructor(props, authToken) {
    super(props);

    this.state = { token: authToken };
  }

  /**
   * Checks the status of the response
   *
   * @param   {object}      response    Response of the API request
   * @param   {Boolean}     parse       Boolean of whether to parse the response or return 'OK'
   *
   * @return  {object|string|null}      Return object|'OK' if success, null if error
   */
  checkStatus = (response, parse) => {
    const res = ErrorHandler.checkStatusCode(response.status);
    if (res.status === 'success') {
      if (parse) {
        return response.json();
      }
      return 'OK';
    }

    return null;
  };

  /**
   * GET Request
   *
   * @param   {string}  url      The URL suffix to the API_URL
   *
   * @return  {object|null}      Return the response from checkStatus
   */
  get = (url) => fetch(API_URL + url, {
    method: 'GET',
    headers: { 'x-Authorization': this.state.token },
  })
    .then((response) => this.checkStatus(response, true))
    .catch((error) => ErrorHandler.apiError(error));

  /**
   * GET an Image
   *
   * @param   {string}  url      The URL suffix to the API_URL
   *
   * @return  {string|null}      Return 'OK' if success and null if error
   */
  getImage = (url) => fetch(`${API_URL + url}?timestamp=${Date.now()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'image/jpeg',
      'x-Authorization': this.state.token,
    },
  })
    .then((response) => {
      if (ErrorHandler.checkSuccess(response.status)) {
        return response;
      }

      return null;
    })
    .catch((error) => ErrorHandler.apiError(error));

  /**
   * POST Request
   *
   * @param   {string}    url                The URL suffix to the API_URL
   * @param   {string?}   body               JSON string of the request body
   * @param   {Boolean?}  responseExpected   If true, checkStatus will parse the result
   * @param   {string?}   contentType        Content-Type header
   *
   * @return  {object|null}                  Return the response from checkStatus
   */
  post = (
    url,
    body = null,
    responseExpected = false,
    contentType = 'application/json',
  ) => fetch(API_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'x-Authorization': this.state.token,
    },
    body,
  })
    .then((response) => this.checkStatus(response, responseExpected))
    .catch((error) => ErrorHandler.apiError(error));

  /**
   * PATCH Request
   *
   * @param   {string}  url             The URL suffix to the API_URL
   * @param   {string}  body            JOSN string of the request body
   * @param   {string?}  contentType    Content-Type header
   *
   * @return  {object|null}             Return the response from checkStatus
   */
  patch = (url, body, contentType = 'application/json') => fetch(API_URL + url, {
    method: 'PATCH',
    headers: {
      'Content-Type': contentType,
      'x-Authorization': this.state.token,
    },
    body,
  })
    .then((response) => this.checkStatus(response))
    .catch((error) => ErrorHandler.apiError(error));

  /**
   * DELETE Request
   *
   * @param   {string}  url      The URL suffix to the API_URL
   */
  delete = (url) => fetch(API_URL + url, {
    method: 'DELETE',
    headers: { 'x-Authorization': this.state.token },
  })
    .then((response) => this.checkStatus(response))
    .catch((error) => ErrorHandler.apiError(error));
}

export default ApiRequests;

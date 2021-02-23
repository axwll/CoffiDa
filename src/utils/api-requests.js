import React, { Component } from 'react';

import ErrorHandler from './error-handler';

const API_URL = 'http://10.0.2.2:3333/api/1.0.0';

class ApiRequests extends Component {
  constructor(props, authToken) {
    super(props);

    this.state = {token: authToken};
  }

  checkStatus = (response, parse) => {
    const res = ErrorHandler.checkStatusCode(response.status);
    if (res.status === 'success') {
      if (parse) {
        return response.json();
      } else {
        return 'OK';
      }
    }

    return null;
  };

  responseCheck = (responseJson) => {
    // check if response has been parsed or retuns OK
    if (responseJson || responseJson === 'OK') {
      return responseJson;
    }

    // Will reach here if request errored
    return null;
  };

  get = (url) => {
    return (
      fetch(API_URL + url, {
        method: 'GET',
        headers: {'x-Authorization': this.state.token},
      })
        .then((response) => this.checkStatus(response, true))
        //   .then((responseJson) => this.responseCheck(responseJson ))
        .catch((error) => ErrorHandler.apiError(error))
    );
  };

  post = (
    url,
    body,
    responseExpected = false,
    contentType = 'application/json',
  ) => {
    return (
      fetch(API_URL + url, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
          'x-Authorization': this.state.token,
        },
        body: body,
      })
        .then((response) => this.checkStatus(response, responseExpected))
        // .then((responseJson) => this.responseCheck(responseJson))
        .catch((error) => ErrorHandler.apiError(error))
    );
  };

  patch = (url, body, contentType = 'application/json') => {
    return fetch(API_URL + url, {
      method: 'PATCH',
      headers: {
        'Content-Type': contentType,
        'x-Authorization': this.state.token,
      },
      body: body,
    })
      .then((response) => this.checkStatus(response))
      .catch((error) => ErrorHandler.apiError(error));
  };

  delete = (url) => {
    return fetch(API_URL + url, {
      method: 'DELETE',
      headers: {
        'Content-Type': contentType,
        'x-Authorization': this.state.token,
      },
    })
      .then((response) => this.checkStatus(response))
      .catch((error) => ErrorHandler.apiError(error));
  };
}

export default ApiRequests;

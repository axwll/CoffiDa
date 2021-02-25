import { Component } from 'react';

import ErrorHandler from './error-handler';

const API_URL = 'http://10.0.2.2:3333/api/1.0.0';

class ApiRequests extends Component {
  constructor(props, authToken) {
    super(props);

    this.state = { token: authToken };
  }

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

  get = (url) => fetch(API_URL + url, {
    method: 'GET',
    headers: { 'x-Authorization': this.state.token },
  })
    .then((response) => this.checkStatus(response, true))
    .catch((error) => ErrorHandler.apiError(error));

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

  delete = (url) => fetch(API_URL + url, {
    method: 'DELETE',
    headers: { 'x-Authorization': this.state.token },
  })
    .then((response) => this.checkStatus(response))
    .catch((error) => ErrorHandler.apiError(error));
}

export default ApiRequests;

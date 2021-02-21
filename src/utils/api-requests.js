import React, { Component } from 'react';
import { API_URL } from 'react-native-dotenv';

class APIRequests extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.setState({token: await getItem('AUTH_TOKEN')});
  }

  checkStatus = (code, parse) => {
    const res = ErrorHandler.checkStatusCode(code);
    if (res.status === 'success') {
      if (parse) {
        return response.json();
      } else {
        return 'OK';
      }
    }

    return res.message;
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
    return fetch(${API_URL} + url, {
      method: 'GET',
      headers: {'x-Authorization': this.state.token},
    })
      .then((response) => this.checkStatus(response.status))
      .then((responseJson) => this.responseCheck(responseJson))
      .catch((error) => ErrorHandler.apiError(error));
  };

  post = (
    url,
    body,
    responseExpected = false,
    contentType = 'application/json',
  ) => {
    return fetch(API_URL + url, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'x-Authorization': this.state.token,
      },
      body: body,
    })
      .then((response) => this.checkStatus(response.status, responseExpected))
      .then((responseJson) => this.responseCheck(responseJson))
      .catch((error) => ErrorHandler.apiError(error));
  };

  patch = (url, body, contentType = 'application/json') => {
    return fetch(API_URL + url, {
      method: 'PATCH',
      headers: {
        'Content-Type': contentType,
        'x-Authorization': this.state.token,
      },
      body: JSON.stringify(body),
    })
      .then((response) => this.checkStatus(response.status))
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
      .then((response) => this.checkStatus(response.status))
      .catch((error) => ErrorHandler.apiError(error));
  };
}

const ApiRequests = new APIRequests();
export default ApiRequests;

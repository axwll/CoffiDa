import React, { Component } from 'react';

const BASE_URL = 'http://10.0.2.2:3333/api/1.0.0/';

class NetworkRequests extends Component {
  get = (url) => {
    return fetch(BASE_URL + url, {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.log('An error occoured during GET ' + url);
        console.log(error);
        return null;
      });
  };

  post = (url, body, contentType = 'application/json') => {
    console.log(BASE_URL + url);
    console.log(body);

    return fetch(BASE_URL + url, {
      method: 'POST',
      headers: {'Content-Type': contentType},
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        return responseJson;
        // console.log('success');
        // Alert.alert('Item Added');
      })
      .catch((error) => {
        console.log('An error occoured during POST ' + url);
        console.log(error);
        return null;
      });
  };

  patch = (url, body, contentType = 'application/json') => {
    return fetch(BASE_URL + url, {
      method: 'PATCH',
      headers: {'Content-Type': contentType},
      body: JSON.stringify(body),
    })
      .then((response) => {
        Alert.alert('Item Updated');
      })
      .catch((error) => {
        console.log('An error occoured during PATCH ' + url);
        console.log(error);
      });
  };

  delete = (url) => {
    return fetch(BASE_URL + url, {method: 'DELETE'})
      .then((response) => {
        Alert.alert('Item Updated');
      })
      .catch((error) => {
        console.log('An error occoured during PATCH ' + url);
        console.log(error);
      });
  };
}

const Requests = new NetworkRequests();
export default Requests;

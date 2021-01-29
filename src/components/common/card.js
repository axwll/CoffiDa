import { faChevronLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Content, Header, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

// import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// https://docs.nativebase.io/Components.html#card-def-headref
class TopBar extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={'#F06543'}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>Profile</Title>
          </Body>

          <Right style={styles.header_right}>
            <FontAwesomeIcon icon={faCog} size={20} color={'#F06543'} />
          </Right>
        </Header>

        <Content style={styles.content}></Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});

export default TopBar;

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Card, CardItem, Container, Content, Header, Left, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

class Settings extends Component {
  render() {
    const navigation = this.props.navigation;

    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={'#F06543'}
                onPress={() => navigation.goBack()}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>Settings</Title>
          </Body>
        </Header>

        <Content padder style={styles.content}>
          <Text>Account maxj131@hotmail.com</Text>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>Change Email Address</Text>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>Reset Password</Text>
              </Body>
            </CardItem>
          </Card>
          <Text>Preferences</Text>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>Currency</Text>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>Permissions</Text>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem>
              <Body>
                <Text>Accessibility</Text>
              </Body>
            </CardItem>
          </Card>
          <Button block>
            <Text>Sign Out</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
//   {/* <Text>Account maxj131@hotmail.com</Text> */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#E8E9EB',
  },
  header: {
    height: 50,
    borderBottomWidth: 0.5,
    backgroundColor: '#E8E9EB',
  },
  header_left: {
    // backgroundColor: 'grey',
    flex: 1,
  },
  header_body: {
    flex: 4,
    alignItems: 'center',
  },
  title: {
    color: 'black',
  },
  header_right: {
    flex: 1,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 12,
    // backgroundColor: 'green',
  },
});

export default Settings;

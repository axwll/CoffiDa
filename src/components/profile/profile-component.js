import {faCog, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Left,
  Right,
  Segment,
  Title,
} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../locales';
import {getItem} from '../common/async-storage-helper';
import FavoriteScreen from './favorites';
import LikeScreen from './likes';
import ReviewScreen from './reviews';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      userInfo: [],
    };
  }

  async componentDidMount() {
    this.setState({
      token: await getItem('AUTH_TOKEN'),
      userInfo: JSON.parse(await getItem('USER_DATA')),
    });
  }

  openSettings = () => {
    this.props.navigation.navigate('Settings', {userInfo: this.state.userInfo});
  };

  selectComponent = (activePage) => () => this.setState({activePage});

  _renderComponent = () => {
    if (this.state.activePage === 1) {
      return <ReviewScreen reviews={this.state.userInfo.reviews} />;
    } else if (this.state.activePage === 2) {
      return (
        <FavoriteScreen favorites={this.state.userInfo.favourite_locations} />
      );
    } else {
      return <LikeScreen likes={this.state.userInfo.liked_reviews} />;
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon icon={faPencilAlt} size={20} color={'#F06543'} />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>Profile</Title>
          </Body>

          <Right style={styles.header_right}>
            <FontAwesomeIcon
              icon={faCog}
              size={20}
              color={'#F06543'}
              onPress={() => this.openSettings()}
            />
          </Right>
        </Header>

        <Content style={styles.content} padder>
          <View>
            <Text>
              {this.state.userInfo.first_name} {this.state.userInfo.last_name}
            </Text>
          </View>
          <View style={styles.segment_view}>
            <Segment style={styles.segment}>
              <Button
                style={[
                  this.state.activePage === 1
                    ? styles.active_segment
                    : styles.segment_btn,
                ]}
                active={this.state.activePage === 1}
                onPress={this.selectComponent(1)}>
                <Text>{translate('reviews')}</Text>
              </Button>
              <Button
                style={[
                  this.state.activePage === 2
                    ? styles.active_segment
                    : styles.segment_btn,
                ]}
                active={this.state.activePage === 2}
                onPress={this.selectComponent(2)}>
                <Text>{translate('favorites')}</Text>
              </Button>
              <Button
                style={[
                  this.state.activePage === 3
                    ? styles.active_segment
                    : styles.segment_btn,
                ]}
                active={this.state.activePage === 3}
                onPress={this.selectComponent(3)}>
                <Text>{translate('likes')}</Text>
              </Button>
            </Segment>
          </View>
          <View style={styles.segment_content}>
            {this.state.userInfo.length === 0 ? (
              <Text>Loading</Text>
            ) : (
              <View>{this._renderComponent()}</View>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

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
  content: {},
  segment: {
    flex: 1,
    flexDirection: 'row',
  },
  segment_view: {
    marginTop: 200,
    backgroundColor: '#FFFFFF',
  },
  segment_btn: {
    flex: 1,
    justifyContent: 'center',
    // border: 'none',

    borderBottomColor: '#E8E9EB',
  },
  active_segment: {
    flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'tomato',
    borderBottomWidth: 3,
    // borderColor: '#E8E9EB',
    borderBottomColor: 'tomato',
  },
  segment_content: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 200,
  },
});

export default Profile;

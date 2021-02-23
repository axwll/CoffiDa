import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Body, Button, Container, Header, Right, Segment, Title } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LoadingSpinner from '../components/loading-spinner';
import { translate } from '../locales';
import ApiRequests from '../utils/api-requests';
import { getItem } from '../utils/async-storage';
import FavoritesTab from './profile-tabs/favorites';
import LikesTab from './profile-tabs/likes';
import ReviewsTab from './profile-tabs/reviews';

let apiRequests = null;

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      activePage: 1,
      userInfo: [],
      tab: 'review',
    };
  }

  async componentDidMount() {
    apiRequests = new ApiRequests(this.props, await getItem('AUTH_TOKEN'));

    this.setState({userId: await getItem('USER_ID')});

    this.getUserInfo();
  }

  getUserInfo = async () => {
    const userId = this.state.userId;

    const response = await apiRequests.get(`/user/${userId}`);

    if (response) {
      this.setState({userInfo: response});
    }

    this.setState({loading: false});
  };

  openSettings = () => {
    this.props.navigation.navigate('Settings', {userInfo: this.state.userInfo});
  };

  selectComponent = (activePage) => () => this.setState({activePage});

  _renderComponent = () => {
    if (this.state.activePage === 1) {
      return (
        <ReviewsTab
          navigation={this.props.navigation}
          reviews={this.state.userInfo.reviews}
        />
      );
    } else if (this.state.activePage === 2) {
      return (
        <FavoritesTab favorites={this.state.userInfo.favourite_locations} />
      );
    } else {
      return (
        <LikesTab
          navigation={this.props.navigation}
          likes={this.state.userInfo.liked_reviews}
        />
      );
    }
  };

  render() {
    if (this.state.loading) {
      return <LoadingSpinner size={50} />;
    } else {
      return (
        <Container style={styles.container}>
          <Header style={styles.header}>
            <Body style={styles.header_body}>
              <Title style={styles.title}>{translate('profile')}</Title>
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

          <View style={styles.content}>
            <View>
              <Text style={styles.username}>
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
              {this._renderComponent()}
            </View>
          </View>
        </Container>
      );
    }
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
  header_body: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#313638',
  },
  header_right: {
    position: 'absolute',
    right: 10,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  username: {
    paddingTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 0,
    paddingBottom: 0,
    backgroundColor: '#E8E9EB',
  },
  segment_view: {
    height: 50,
    backgroundColor: '#E8E9EB',
  },
  segment_btn: {
    flex: 1,
    justifyContent: 'center',
    borderBottomColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderColor: '#E8E9EB',
  },
  active_segment: {
    flex: 1,
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#F06543',
    backgroundColor: '#E8E9EB',
    borderColor: '#E8E9EB',
  },
  segment_content: {
    flex: 1,
  },
});

export default Profile;

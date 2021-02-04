import {faHeart, faStar} from '@fortawesome/free-regular-svg-icons';
import {
  faChevronLeft,
  faDirections,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Left,
  Right,
  Title,
} from 'native-base';
import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import Star from './common/star';

class SelectedShop extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const shopData = this.props.navigation.getParam('shopData');
    console.log(shopData);
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Left style={styles.header_left}>
            <Button transparent>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={20}
                color={'#F06543'}
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          </Left>

          <Body style={styles.header_body}>
            <Title style={styles.title}>{shopData.location_name}</Title>
          </Body>

          <Right style={styles.header_right}>
            <FontAwesomeIcon icon={faStar} size={20} color={'#F06543'} />
          </Right>
        </Header>

        <Content style={styles.content} padder>
          <ScrollView>
            <Card>
              <CardItem cardBody button>
                <Image
                  source={require('../assets/lofi-coffee.png')}
                  style={{height: 200, width: 100, flex: 1}}
                />
              </CardItem>
              <CardItem style={styles.carditem_two}>
                <View style={styles.icon}>
                  <FontAwesomeIcon icon={faPlus} size={20} color={'#F06543'} />
                </View>
                <View style={styles.num_reviews}>
                  <Text>
                    {shopData.location_reviews.length} review(s) for{' '}
                    {shopData.location_name}, {shopData.location_town}
                  </Text>
                </View>
                <View style={styles.icon}>
                  <FontAwesomeIcon
                    icon={faDirections}
                    size={20}
                    color={'#F06543'}
                  />
                </View>
              </CardItem>
              <CardItem style={styles.reviews_card}>
                <Star
                  name="Price"
                  rating={shopData.avg_price_rating}
                  rotate={true}
                />
                <Star
                  name="Cleanliness"
                  rating={shopData.avg_clenliness_rating}
                  rotate={true}
                />
                <Star
                  name="Quality"
                  rating={shopData.avg_quality_rating}
                  rotate={true}
                />
              </CardItem>
            </Card>

            <View style={styles.sub_heading_view}>
              <Title style={styles.sub_heading_text}>Ratings & Reviews</Title>
            </View>

            {shopData.location_reviews.map((review) => {
              return (
                <Card key={review.review_id}>
                  <CardItem style={styles.first_item}>
                    <Left>
                      <Text style={styles.user}>
                        User: {review.review_user_id}
                      </Text>
                    </Left>

                    <Right style={styles.right}>
                      <Star
                        rating={review.review_overallrating}
                        size={15}
                        spacing={5}
                      />
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Left>
                      <Text>{review.review_body}</Text>
                    </Left>

                    <Right>
                      <Text style={styles.light_text}>
                        Price: {review.review_pricerating}/5
                      </Text>
                      <Text style={styles.light_text}>
                        Cleanliness: {review.review_clenlinessrating}/5
                      </Text>
                      <Text style={styles.light_text}>
                        Quality: {review.review_qualityrating}/5
                      </Text>
                    </Right>
                  </CardItem>
                  <CardItem style={styles.last_item}>
                    <Left>
                      <Button transparent style={styles.light_text}>
                        <FontAwesomeIcon
                          icon={faHeart}
                          size={15}
                          color={'#F06543'}
                        />
                      </Button>
                      <Text style={styles.like_count}>{review.likes}</Text>
                    </Left>
                  </CardItem>
                </Card>
              );
            })}
          </ScrollView>
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
    color: '#313638',
  },
  sub_heading_view: {
    flex: 1,
    alignItems: 'center',
  },
  sub_heading_text: {
    color: '#313638',
  },
  header_right: {
    flex: 1,
  },
  content: {},
  carditem_two: {
    flex: 1,
    flexDirection: 'row',
  },
  num_reviews: {
    flex: 10,
    alignItems: 'center',
  },
  user: {
    color: 'tomato',
    fontWeight: 'bold',
  },

  icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviews_card: {
    height: 200,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  light_text: {
    color: '#313638',
  },
  like_btn: {
    paddingRight: 5,
  },
  last_item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  first_item: {
    paddingBottom: 0,
    marginBottom: 0,
  },
});

export default SelectedShop;

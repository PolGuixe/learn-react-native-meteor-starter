import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import { Text } from 'react-native';
import { Card, Button, List, ListItem } from 'react-native-elements';
import moment from 'moment';
import Container from '../components/Container';
import colors from '../config/colors';
import config from '../config/config';
import NotFound from '../components/NotFound';
import { Header } from '../components/Text';

const CHECKED_IN = 'in';
const CHECKED_OUT = 'out';

class LocationDetails extends Component {
  static propTypes = {
    location: PropTypes.object,
    navigator: PropTypes.object,
    activityReady: PropTypes.bool,
    activity: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      changingStatus: false,
    };
  }

  attemptCheckin = () => {
    const { location } = this.props;
    let status = CHECKED_IN;
    if (location.checkedInUserId) {
      status = CHECKED_OUT;
    }
    this.setState({ changingStatus: true });
    Meteor.call('Locations.changeCheckin', { locationId: location._id, status }, (error) => {
      if (error) {
        this.props.navigator.showLocalAlert(error.reason, config.errorStyles);
      }
      this.setState({ changingStatus: false });
    });
  }

  renderItems = () => {
    const { activityReady, activity } = this.props;
    if (!activityReady) {
      return <Header>Loading...</Header>;
    } else if (activity.length === 0) {
      return (
        <NotFound
          text="No Activity Yet"
          small
        />
      );
    } else {
      return (
        _.map(activity, activityItem => (
          <ListItem
            key={activityItem._id}
            title={activityItem.username}
            subtitle={moment(activityItem.createdAt).format('MMM Do @ hh:mma')}
            rightTitle={activityItem.type === CHECKED_IN ? 'Checked In' : 'Checked Out'}
          />
        ))
      );
    }
  }

  render() {
    const location = this.props.location || _.get(this.props, 'route.params.location', {});
    const userId = _.get(this.props, 'user._id', 'demo');

    const checkedIn = location.checkedInUserId === userId;
    const available = typeof location.checkedInUserId !== 'string';

    let icon = { name: 'check' };
    let title = 'Check In';
    let backgroundColor = colors.primary;

    if (checkedIn) {
      icon = { name: 'close' };
      title = 'Check Out';
      backgroundColor = colors.red;
    } else if (!available) {
      icon = { name: 'close' };
      title = 'Not Available';
    }

    return (
      <Container scroll>
        <Card
          title={location.station_name}
        >
          <Text>{location.street_address}</Text>
          <Text>{location.access_days_time}</Text>
        </Card>
        <Button
          raised
          icon={icon}
          title={title}
          backgroundColor={backgroundColor}
          buttonStyle={{ marginVertical: 20 }}
          disabled={!available && !checkedIn}
          onPress={this.attemptCheckin}
          loading={this.state.changingStatus}
        />
        <Card
          title="Activity"
        >
          <List
            containerStyle={{
              borderTopWidth: 0,
              borderBottomWidth: 0,
              marginTop: 0,
            }}
          >
            {this.renderItems()}
          </List>
        </Card>
      </Container>
    );
  }
}

const ConnectedLocationDetails = createContainer((params) => {
  const location = _.get(params, 'route.params.location', {});

  Meteor.subscribe('Locations.pub.details', { locationId: location._id });
  const activityHandle = Meteor.subscribe('Activity.pub.list', { locationId: location._id });

  return {
    user: Meteor.user(),
    location: Meteor.collection('locations').findOne({ _id: location._id }),
    activityReady: activityHandle.ready(),
    activity: Meteor.collection('activity').find({ locationId: location._id }, { sort: { createdAt: -1 } }),
  };
}, LocationDetails);

ConnectedLocationDetails.route = {
  navigationBar: {
    visible: true,
    title: 'Location Details',
  },
};

export default ConnectedLocationDetails;

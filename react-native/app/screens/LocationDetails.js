import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Container from '../components/Container';
import colors from '../config/colors';

class LocationDetails extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Location Details',
    },
  }

  static propTypes = {
    route: PropTypes.object,
  }

  render() {
    const { location } = this.props.route.params;
    const userId = _.get(this.props, 'user._id', '');
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
        />
      </Container>
    );
  }
}

export default LocationDetails;

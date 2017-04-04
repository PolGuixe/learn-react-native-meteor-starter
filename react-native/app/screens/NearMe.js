import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'react-native-elements';
import Container from '../components/Container';
import Router from '../config/router';

class NearMe extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me',
    },
  }

  static propTypes = {
    route: PropTypes.object,
    navigator: PropTypes.object,
  }

  subTitle = (location) => {
    let subtitle = '';
    if (location.street_address) {
      subtitle = location.street_address;
    }

    if (location.access_days_time && subtitle.length) {
      subtitle = `${subtitle} - ${location.access_days_time}`;
    } else if (location.access_days_time) {
      subtitle = location.access_days_time;
    }

    return subtitle;
  };

  goToLocationDetails = (location) => {
    this.props.navigator.push(Router.getRoute('locationDetails', { location }));
  }

  render() {
    const { locations } = this.props.route.params;
    return (
      <Container scroll>
        <List>
          {locations.map(location => (
            <ListItem
              key={location._id}
              title={location.station_name}
              subtitle={this.subTitle(location)}
              onPress={() => this.goToLocationDetails(location)}
            />
          ))}
        </List>
      </Container>
    );
  }
}


export default NearMe;

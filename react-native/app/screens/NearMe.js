import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'react-native-elements';
import { View } from 'react-native';
import Container from '../components/Container';
import Router from '../config/router';
import FloatingButton from '../components/FloatingButton';

class NearMe extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me',
    },
  };

  static propTypes = {
    route: PropTypes.object,
    navigator: PropTypes.object,
  };

  subTitle = location => {
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

  goToLocationDetails = location => {
    this.props.navigator.push(Router.getRoute('locationDetails', { location }));
  };

  goToNearMeMap = () => {
    const { locations, position } = this.props.route.params;
    this.props.navigator.replace(Router.getRoute('nearMeMap', { locations, position }));
  };

  render() {
    const { locations, position } = this.props.route.params;
    return (
      <View>
        <Container scroll>
          <List>
            {locations.map(location => (
              <ListItem
                key={location._id}
                title={location.station_name}
                subtitle={this.subTitle(location)}
                onPress={() => this.goToLocationDetails({ location, position })}
              />
            ))}
          </List>
        </Container>
        <FloatingButton onPress={this.goToNearMeMap} icon="map" />
      </View>
    );
  }
}

export default NearMe;

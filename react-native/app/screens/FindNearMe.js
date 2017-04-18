import React, { Component, PropTypes } from 'react';
import Meteor from 'react-native-meteor';
import Container from '../components/Container';
import { Header } from '../components/Text';
import LocateMeButton from '../components/LocateMeButton';
import config from '../config/config';
import Router from '../config/router';


const geoSettings = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
};


class FindNearMe extends Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  }

  static propTypes = {
    navigator: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  handleGeolocationSuccess = (position) => {
    const params = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    this.setState({ loading: true });
    Meteor.call('Locations.getNearestLocations', params, (error, locations) => {
      if (error) {
        this.props.navigator.showLocalAlert(error.reason, config.errorStyles);
      } else {
        console.log(locations);
        this.props.navigator.push(Router.getRoute('nearMe', { locations, position }));
      }
      this.setState({ loading: false });
    });
  };

  handleGeolocationError = (error) => {
    this.props.navigator.showLocalAlert(error.message, config.errorStyles);
  };

  goToNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      this.handleGeolocationSuccess,
      this.handleGeolocationError,
      geoSettings,
    );
  }

  render() {
    return (
      <Container>
        <LocateMeButton
          onPress={this.goToNearMe}
          loading={this.state.loading}
        />
        <Header>
          Find Near Me
        </Header>
      </Container>
    );
  }
}

export default FindNearMe;

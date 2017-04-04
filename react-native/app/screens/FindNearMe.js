import React, { Component, PropTypes } from 'react';
import Container from '../components/Container';
import { Header } from '../components/Text';
import LocateMeButton from '../components/LocateMeButton';
import config from '../config/config';


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

  handleGeolocationSuccess = (position) => {
    console.log('latitude', position.coords.latitude);
    console.log('longitude', position.coords.longitude);
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
          onPress={() => this.goToNearMe()}
        />
        <Header>
          Find Near Me
        </Header>
      </Container>
    );
  }
}

export default FindNearMe;

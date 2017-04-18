import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet } from 'react-native';
import Container from '../components/Container';
import Router from '../config/router';
import FloatingButton from '../components/FloatingButton';
import MapCallout, { styles as mapCalloutStyles } from '../components/MapCallout';

class NearMeMap extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Near Me Map',
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

  goToNearMe = () => {
    const { locations, position } = this.props.route.params;
    this.props.navigator.replace(Router.getRoute('nearMe', { locations, position }));
  };

  render() {
    const { locations, position } = this.props.route.params;

    return (
      <Container>
        <MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          initialRegion={{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
        >
          {_.map(locations, location => {
            const [longitude, latitude] = location.location.coordinates;
            return (
              <MapView.Marker key={location._id} coordinate={{ latitude, longitude }}>
                <MapView.Callout
                  style={mapCalloutStyles.calloutContainer}
                  tooltip
                  onPress={() => this.goToLocationDetails(location)}
                >
                  <MapCallout
                    title={location.station_name}
                    description={this.subTitle(location)}
                    onPress={() => this.goToLocationDetails(location)}
                  />
                </MapView.Callout>

              </MapView.Marker>
            );
          })}
        </MapView>
        <FloatingButton onPress={this.goToNearMe} icon="list" />
      </Container>
    );
  }
}

export default NearMeMap;

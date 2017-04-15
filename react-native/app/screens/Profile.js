import React, { Component, PropTypes } from 'react';
import Meteor from 'react-native-meteor';
import { PrimaryButton } from '../components/Form';
import Container from '../components/Container';
import Router from '../config/router';

import { Header } from '../components/Text';

class Profile extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Profile',
    },
  };

  static propTypes = {
    navigator: PropTypes.object,
  }

  logout = () => {
    Meteor.logout();
    this.props.navigator.immediatelyResetStack([Router.getRoute('signIn')]);
  };

  render() {
    return (
      <Container>
        <Header>
          Profile
        </Header>
        <PrimaryButton title="Logout" onPress={this.logout} />
      </Container>
    );
  }
}

export default Profile;

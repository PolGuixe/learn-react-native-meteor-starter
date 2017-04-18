import React, { Component, PropTypes } from 'react';
import Meteor from 'react-native-meteor';
import { Card } from 'react-native-elements';
import Router from '../config/router';
import Container from '../components/Container';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';
import config from '../config/config';

class SignIn extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Sign In',
    },
  };

  static propTypes = {
    navigator: PropTypes.object,
    fromSignUp: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: '',
      password: '',
      signingIn: false,
    };
  }

  goToSignUp = () => {
    if (this.props.fromSignUp) {
      this.props.navigator.pop();
    } else {
      this.props.navigator.push(Router.getRoute('signUp'));
    }
  };

  signIn = () => {
    const { emailOrUsername, password } = this.state;

    if (emailOrUsername.length === 0) {
      return this.props.navigator.showLocalAlert(
        'You need to provide a username or email to sign in',
        config.errorStyles,
      );
    }
    if (password.length === 0) {
      return this.props.navigator.showLocalAlert(
        'Your password should not be empty',
        config.errorStyles,
      );
    }
    this.setState({ signingIn: true });
    return Meteor.loginWithPassword(emailOrUsername, password, error => {
      this.setState({ signingIn: false });
      if (error) {
        this.props.navigator.showLocalAlert(error.reason, config.errorStyles);
      } else {
        this.props.navigator.immediatelyResetStack([Router.getRoute('profile')]);
      }
    });
  };

  render() {
    return (
      <Container scroll>
        <Card>
          <Input
            label="Email or username"
            placeholder="Please enter your email or username ..."
            keyboardType="email-address"
            value={this.state.emailOrUsername}
            onChangeText={emailOrUsername => this.setState({ emailOrUsername })}
          />
          <Input
            label="Password"
            placeholder="Please enter your password ..."
            secureTextEntry
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <PrimaryButton title="Sign In" onPress={this.signIn} loading={this.state.signingIn} />
        </Card>
        <SecondaryButton title="Sign Up" onPress={this.goToSignUp} />
      </Container>
    );
  }
}

export default SignIn;

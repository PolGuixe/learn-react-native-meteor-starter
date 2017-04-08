import React, { Component, PropTypes } from 'react';
import { Card } from 'react-native-elements';
import { Accounts } from 'react-native-meteor';
import Container from '../components/Container';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';
import Router from '../config/router';
import config from '../config/config';

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

class SignUp extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Sign Up',
    },
  };

  static propTypes = {
    navigator: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      signingUp: false,
    };
  }

  goToSignIn = () => {
    this.props.navigator.push(Router.getRoute('signIn'));
  };

  handleChangeEmail = email => {
    const { username } = this.state;
    const update = { email };
    const inferredUsername = email.split('@')[0];
    if (username === inferredUsername.slice(0, inferredUsername.length - 1)) {
      update.username = inferredUsername;
    }
    this.setState(update);
  };

  signUp = () => {
    const { email, username, password, confirmPassword } = this.state;

    if (email.length === 0 || !validateEmail(email)) {
      return this.props.navigator.showLocalAlert('Not valid email', config.errorStyles);
    }
    if (username.length === 0 ) {
      return this.props.navigator.showLocalAlert(
        'You need to provide a username',
        config.errorStyles,
      );
    }
    if (password.lenght === 0 || password !== confirmPassword) {
      return this.props.navigator.showLocalAlert('Passwords do not match', config.errorStyles);
    }
    this.setState({ signingUP: true });
    Accounts.createUser({ username, email, password }, error => {
      this.setState({ signingUP: false });
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
            label="Email"
            placeholder="Please enter your email ..."
            keyboardType="email-address"
            value={this.state.email}
            onChangeText={email => this.handleChangeEmail(email)}
          />
          <Input
            label="Username"
            placeholder="Please enter your username ..."
            keyboardType="default"
            value={this.state.username}
            onChangeText={username => this.setState({ username })}
          />
          <Input
            label="Password"
            placeholder="Please enter your Password ..."
            keyboardType="default"
            secureTextEntry
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
          />
          <Input
            label="Confirm Password"
            placeholder="Please confirm your Password ..."
            keyboardType="default"
            secureTextEntry
            value={this.state.confirmPassword}
            onChangeText={confirmPassword => this.setState({ confirmPassword })}
          />
          <PrimaryButton title="Sign Up" loading={this.state.signingUp} onPress={this.signUp} />
        </Card>
        <SecondaryButton title="Sign In" onPress={this.goToSignIn} />
      </Container>
    );
  }
}

export default SignUp;

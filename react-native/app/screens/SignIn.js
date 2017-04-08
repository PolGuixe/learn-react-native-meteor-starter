import React, { Component, PropTypes } from 'react';
import { Card } from 'react-native-elements';
import Router from '../config/router';
import Container from '../components/Container';
import { Input, PrimaryButton, SecondaryButton } from '../components/Form';

class SignIn extends Component {
  static route = {
    navigationBar: {
      visible: true,
      title: 'Sign In',
    },
  };

  static propTypes = {
    navigator: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      emailOrUsername: '',
      password: '',
    };
  }

  goToSignUp = () => {
    this.props.navigator.pop();
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
          <PrimaryButton title="Sign In" />
        </Card>
        <SecondaryButton title="Sign Up" onPress={this.goToSignUp} />
      </Container>
    );
  }
}

export default SignIn;

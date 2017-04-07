import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser(function onCreatedUser(options, user) {
  if (!user.username) {
    user.username = user.mail.split('@')[0]; //eslint-disable-line
  }

  return user;
});

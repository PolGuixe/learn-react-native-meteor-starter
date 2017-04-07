import { Accounts } from 'meteor/accounts-base';

Accounts.onCreatedUser(function onCreatedUser(options, user) {
  if (!user.username) {
    user.username = user.mail.split('@')[0]; //eslint-disable-line
  }

  return user;
});

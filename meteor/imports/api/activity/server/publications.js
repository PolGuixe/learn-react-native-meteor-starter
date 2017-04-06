import { Meteor } from 'meteor/meteor';
import { Activity } from '../activity';

Meteor.publish('Activity.pub.list', function getLocationActivity({ locationId }) {
  const selector = { locationId };
  const options = {
    sort: { createdAt: -1 },
    limit: 5,
  };

  return Activity.find(selector, options);
});

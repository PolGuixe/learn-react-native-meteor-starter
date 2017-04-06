import { Meteor } from 'meteor/meteor';
import { Locations } from '../locations';

Meteor.publish('Locations.pub.details', function getLocationDetails({ locationId }) {
  // TODO validate locationId
  const selector = {
    _id: locationId,
  };
  const options = {
    limit: 1,
  };

  return Locations.find(selector, options);
});

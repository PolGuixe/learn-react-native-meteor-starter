import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Locations } from './locations';

Meteor.methods({
  'Locations.getNearestLocations': function getNearestLocations(params) {
    console.log(params);
    // check(position.longitude, String);
    // check(position.latitude, String);

    const selector = {};
    const options = {
      limit: 10,
    };

    return Locations.find(selector, options).fetch();
  },
});

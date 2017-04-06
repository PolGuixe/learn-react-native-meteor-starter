import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Locations } from './locations';
import { Activity } from '../activity/activity';

export const getNearestLocations = new ValidatedMethod({
  name: 'Locations.getNearestLocations',
  validate: new SimpleSchema({
    latitude: { type: Number, decimal: true },
    longitude: { type: Number, decimal: true },
  }).validator(),
  run({ latitude, longitude }) {
    const selector = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $minDistance: 0,
        },
      },
    };
    const options = {
      limit: 10,
    };

    return Locations.find(selector, options).fetch();
  },
});

export const changeCheckinStatus = new ValidatedMethod({
  name: 'Locations.changeCheckin',
  validate: new SimpleSchema({
    locationId: { type: String },
    status: { type: String, allowedValues: ['in', 'out'] },
  }).validator(),
  run({ locationId, status }) {
    const location = Locations.findOne({ _id: locationId });

    if (location) {
      switch (status) {
        case 'in':
          Locations.update(
            { _id: locationId },
            {
              $set: { checkedInUserId: 'demo' },
            },
          );
          break;
        default:
          Locations.update(
            { _id: locationId },
            {
              $set: { checkedInUserId: null },
            },
          );
          break;
      }
      
      Activity.insert({
        createdAt: new Date(),
        username: 'demo',
        userId: 'demo',
        type: status,
        locationId,
      });
    } else {
      throw new Meteor.Error(
        'Locations.changeCheckin.invalidLocationId',
        'Must pass a valid location id to change checkin status.',
      );
    }
  },
});

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
    // Throw error iF user not logged in
    if (!this.userId) {
      throw new Meteor.Error('Locations.changeCheckin.userNotLogged', 'You must be logged in');
    }

    const location = Locations.findOne({ _id: locationId });

    if (location) {
      switch (status) {
        case 'in':
          if (location.checkedInUserId === this.userId) {
            throw new Meteor.Error(
              'Locations.changeCheckin.currentUserAlreadyIn',
              'You are alredy checked in',
            );
          }
          if (typeof location.checkedInUserId === 'string') {
            throw new Meteor.Error(
              'Locations.changeCheckin.otherUserAlreadyIn',
              'Another user is alredy checked in',
            );
          }
          if (Locations.findOne({ checkedInUserId: this.userId })) {
            throw new Meteor.Error(
              'Locations.changeCheckin.currentUserCheckedInDifferentLocation',
              'The current user is already checked into a different location',
            );
          }

          Locations.update(
            { _id: locationId },
            {
              $set: { checkedInUserId: this.userId },
            },
          );
          break;
        case 'out':
          if (location.checkedInUserId !== this.userId) {
            throw new Meteor.Error(
              'Locations.changeCheckin.currentUserNotCheckedIn',
              'You are not checked in',
            );
          }

          Locations.update(
            { _id: locationId },
            {
              $set: { checkedInUserId: null },
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
        username: Meteor.user().username,
        userId: this.userId,
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

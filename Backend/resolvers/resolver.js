const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Game = require('../models/game.js');
const Notification = require('../models/notification');
const SubscriptionType = require('../models/subscriptionType');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();
const NEW_GAME_LAUNCHED = 'NEW_GAME_LAUNCHED';
const NEW_SUBSCRIPTION_NOTIFICATION = 'NEW_SUBSCRIPTION_NOTIFICATION';

const resolvers = {
  Query: {
    getUser: async (_, { userId }) => {
      return await User.findById(userId);
    },
    getGames: async () => {
      return await Game.find();
    },
    getNotifications: async (_, { userId }) => {
      return await Notification.find({ userId });
    },
    getSubscriptionTypes: async () => {
      return await SubscriptionType.find();
    },
  },
  Mutation: {
    signup: async (_, { email, password }) => {
      try {
        console.log('Signup mutation called with email:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log('User with email', email, 'already exists');
          throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        console.log('New user saved:', newUser);

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('JWT token generated for user:', newUser.id);
        return token;
      } catch (error) {
        console.error('Signup failed:', error.message);
        throw new Error('Signup failed: ' + error.message);
      }
    },
    login: async (_, { email, password }) => {
      try {
        console.log('Login mutation called with email:', email);
        const user = await User.findOne({ email });
        if (!user) {
          console.log('User with email', email, 'not found');
          throw new Error('Invalid email or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          console.log('Invalid password for user:', user.id);
          throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('JWT token generated for user:', user.id);
        return token;
      } catch (error) {
        console.error('Login failed:', error.message);
        throw new Error('Login failed: ' + error.message);
      }
    },
    launchGame: async (_, { title, genre, releaseDate, subscriptionTypeIds }) => {
      const newGame = new Game({ title, genre, releaseDate });
      await newGame.save();
      console.log('Publishing new game launch:', { newGameLaunched: newGame });
      pubsub.publish(NEW_GAME_LAUNCHED, { newGameLaunched: newGame }).then(() => console.log('Published NEW_GAME_LAUNCHED event'))
        .catch(err => console.log('Failed to publish NEW_GAME_LAUNCHED event'));
      const subscribedUsers = await User.find({ subscriptions: { $in: subscriptionTypeIds } });
      for (const user of subscribedUsers) {
        const notification = new Notification({
          userId: user.id,
          content: `New game launched: ${title}`,
          seen: false
        });
        await notification.save();
        console.log('Publishing new subscription notification:', { newSubscriptionNotification: notification });
        pubsub.publish(NEW_SUBSCRIPTION_NOTIFICATION, { newSubscriptionNotification: notification })
          .catch(err => console.error('Failed to publish new subscription notification:', err));
        console.log('Notification object before publishing:', notification);
      }
      return newGame;
    },
    createSubscriptionType: async (_, { name, description, associatedGames }) => {
      const newSubscriptionType = new SubscriptionType({ name, description, associatedGames });
      await newSubscriptionType.save();
      return newSubscriptionType;
    },
    subscribeToNotifications: async (_, { userId, subscriptionTypeId }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.subscriptions.push(subscriptionTypeId);
      await user.save();
      return true;
    },
    markNotificationAsSeen: async (_, { notificationId }) => {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }
      notification.seen = true;
      await notification.save();
      return true;
    },
  },
  Subscription: {
    newSubscriptionNotification: {
      subscribe: () => pubsub.asyncIterator([NEW_SUBSCRIPTION_NOTIFICATION]),
      resolve: (payload) => {
        console.log('Resolver for newSubscriptionNotification triggered with payload:', payload);
        if (!payload.newSubscriptionNotification) {
          throw new Error('Notification not found');
        }
        return {
          id: payload.newSubscriptionNotification._id,
          userId: payload.newSubscriptionNotification.userId,
          content: payload.newSubscriptionNotification.content,
          seen: payload.newSubscriptionNotification.seen
        };
      },
    },
  },
};

module.exports = resolvers;

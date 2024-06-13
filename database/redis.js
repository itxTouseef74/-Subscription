require('dotenv').config();
const Redis = require('ioredis');
const { RedisPubSub } = require('graphql-redis-subscriptions');

const options = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: times => Math.min(times * 50, 2000),
};

const publisherClient = new Redis(options);
const subscriberClient = new Redis(options);

publisherClient.on('connect', () => {
  console.log('Connected to Redis (publisher) successfully.');
});

subscriberClient.on('connect', () => {
  console.log('Connected to Redis (subscriber) successfully.');
});

publisherClient.on('error', (err) => {
  console.error('Redis publisher client error:', err);
});

subscriberClient.on('error', (err) => {
  console.error('Redis subscriber client error:', err);
});

process.on('exit', () => {
  publisherClient.quit();
  subscriberClient.quit();
});

const pubsub = new RedisPubSub({
  publisher: publisherClient,
  subscriber: subscriberClient,
});

module.exports = {
  publisherClient,
  subscriberClient,
  pubsub
};

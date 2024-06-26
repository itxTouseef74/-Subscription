import { createStore } from 'vuex';
import { gql } from 'graphql-tag';
import { apolloClient } from '../apollo';
import { useMutation } from '@vue/apollo-composable';

const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotifications($userId: ID!) {
    getNotifications(userId: $userId) {
      id
      content
      seen
    }
  }
`;

const MARK_NOTIFICATION_AS_SEEN_MUTATION = gql`
  mutation MarkNotificationAsSeen($notificationId: ID!) {
    markNotificationAsSeen(notificationId: $notificationId)
  }
`;

const GET_SUBSCRIPTION_TYPES_QUERY = gql`
  query GetSubscriptionTypes {
    getSubscriptionTypes {
      id
      name
      description
    }
  }
`;

const SUBSCRIBE_TO_NOTIFICATIONS_MUTATION = gql`
  mutation SubscribeToNotifications($userId: ID!, $subscriptionTypeId: ID!) {
    subscribeToNotifications(userId: $userId, subscriptionTypeId: $subscriptionTypeId)
  }
`;

export default createStore({
  state: {
    notifications: [],
    subscriptionTypes: [],
    userSubscriptions: [],
  },
  mutations: {
    setNotifications(state, notifications) {
      state.notifications = notifications;
    },
    addNotification(state, notification) {
      state.notifications.push(notification);
    },
    markNotificationAsSeen(state, notificationId) {
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.seen = true;
      }
    },
    setSubscriptionTypes(state, subscriptionTypes) {
      state.subscriptionTypes = subscriptionTypes;
    },
    addUserSubscription(state, subscriptionId) {
      state.userSubscriptions.push(subscriptionId);
    },
  },
  actions: {
    async fetchNotifications({ commit }, userId) {
      try {
        const { data } = await apolloClient.query({
          query: GET_NOTIFICATIONS_QUERY,
          variables: { userId },
        });
        commit('setNotifications', data.getNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    },
    async markNotificationAsSeen({ commit }, notificationId) {
      try {
        await apolloClient.mutate({
          mutation: MARK_NOTIFICATION_AS_SEEN_MUTATION,
          variables: { notificationId },
        });
        commit('markNotificationAsSeen', notificationId);
      } catch (error) {
        console.error('Failed to mark notification as seen', error);
      }
    },
    async fetchSubscriptionTypes({ commit }) {
      try {
        const { data } = await apolloClient.query({
          query: GET_SUBSCRIPTION_TYPES_QUERY,
        });
        commit('setSubscriptionTypes', data.getSubscriptionTypes);
      } catch (error) {
        console.error('Failed to fetch subscription types', error);
      }
    },
    async subscribeToNotifications({ commit }, { userId, subscriptionTypeId }) {
      try {
        await apolloClient.mutate({
          mutation: SUBSCRIBE_TO_NOTIFICATIONS_MUTATION,
          variables: { userId, subscriptionTypeId },
        });
        commit('addUserSubscription', subscriptionTypeId);
      } catch (error) {
        console.error('Failed to subscribe to notifications', error);
      }
    },
  },
  getters: {
    unreadNotifications(state) {
      return state.notifications.filter(notification => !notification.seen);
    },
    isSubscribed: (state) => (subscriptionId) => {
      return state.userSubscriptions.includes(subscriptionId);
    },
  },
});
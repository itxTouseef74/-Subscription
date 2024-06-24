<template>
  <v-container>
    <v-list v-if="notifications.length > 0">
      <v-list-item v-for="notification in notifications" :key="notification.id">
        <v-list-item-content>
          <v-list-item-title>{{ notification.content }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="markNotificationAsSeen(notification.id)" :disabled="notification.seen">
            {{ notification.seen ? 'Seen' : 'Mark as seen' }}
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <div v-else>
      No notifications found.
    </div>
  </v-container>
</template>

<script>
import { gql } from 'graphql-tag';
import { ref, onMounted, watch } from 'vue';
import { useQuery, useMutation, provideApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '../apollo';
import {jwtDecode} from 'jwt-decode';
import { ApolloClient, InMemoryCache, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';


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

const NEW_SUBSCRIPTION_NOTIFICATION = gql`
  subscription {
    newSubscriptionNotification {
      id
      userId
      content
      seen
    }
  }
`;

export default {
  setup() {
    provideApolloClient(apolloClient);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = ref(decodedToken.userId);

    const { result: notificationsResult, loading, error, refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS_QUERY, { userId });

    const { mutate: markAsSeen } = useMutation(MARK_NOTIFICATION_AS_SEEN_MUTATION);

    const markNotificationAsSeen = async (notificationId) => {
      try {
        await markAsSeen({ notificationId });
    
        refetchNotifications();
      } catch (err) {
        console.error('Failed to mark notification as seen', err);
      }
    };

    const notifications = ref([]);

    watch(notificationsResult, (newVal) => {
      if (newVal && newVal.getNotifications) {
        notifications.value = newVal.getNotifications;
      }
    });

    
    const wsLink = new WebSocketLink({
      uri: 'ws://localhost:4000/graphql',
      options: {
        reconnect: true,
      },
    });

    const subscriptionClient = new ApolloClient({
      link: wsLink,
      cache: new InMemoryCache(),
    });

    subscriptionClient
      .subscribe({
        query: NEW_SUBSCRIPTION_NOTIFICATION,
      })
      .subscribe({
        next({ data }) {
          if (data && data.newSubscriptionNotification) {
            notifications.value.push(data.newSubscriptionNotification);
          }
        },
        error(err) {
          console.error('Subscription error', err);
        },
      });

    onMounted(() => {
      refetchNotifications();
    });

    return {
      notifications,
      loading,
      error,
      markNotificationAsSeen,
    };
  },
};
</script>

<style scoped>

</style>

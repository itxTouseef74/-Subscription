<template>
    <v-container>
      <v-list v-if="subscriptionTypes.length > 0">
        <v-list-item v-for="subscription in subscriptionTypes" :key="subscription.id">
          <v-list-item-content>
            <v-list-item-title>{{ subscription.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ subscription.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn @click="subscribe(subscription.id)" :disabled="isSubscribed(subscription.id)">
              {{ isSubscribed(subscription.id) ? 'Subscribed' : 'Subscribe' }}
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div v-else>
        No subscription types found.
      </div>
    </v-container>
  </template>
  
  <script>
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { provideApolloClient } from '@vue/apollo-composable';
  import { apolloClient } from '../apollo';
  import { jwtDecode } from 'jwt-decode';
  import { WebSocketLink } from '@apollo/client/link/ws';
  import { ApolloClient, InMemoryCache } from '@apollo/client/core';
  import gql from 'graphql-tag';
  
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
  
  export default defineComponent({
    setup() {
      provideApolloClient(apolloClient);
      const store = useStore();
  
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
  
      const subscriptionTypes = computed(() => store.state.subscriptionTypes);
      const isSubscribed = (subscriptionId) => {
        return store.getters.isSubscribed(subscriptionId);
      };
  
      onMounted(() => {
        store.dispatch('fetchSubscriptionTypes');
      });
  
      const wsLink = new WebSocketLink({
        uri: 'ws://localhost:9000/graphql',
        options: {
          reconnect: true,
        },
      });
  
      const subscriptionClient = new ApolloClient({
        link: wsLink,
        cache: new InMemoryCache(),
      });
  
      subscriptionClient.subscribe({
        query: NEW_SUBSCRIPTION_NOTIFICATION,
        next({ data }) {
          if (data && data.newSubscriptionNotification) {
            store.commit('addNotification', data.newSubscriptionNotification);
          }
        },
        error(err) {
          console.error('Subscription error', err);
        },
      });
  
      const subscribe = (subscriptionId) => {
        store.dispatch('subscribeToNotifications', {
          userId,
          subscriptionTypeId: subscriptionId,
        });
      };
  
      return {
        subscriptionTypes,
        isSubscribed,
        subscribe,
      };
    },
  });
  </script>
  
  <style scoped>
  </style>
  
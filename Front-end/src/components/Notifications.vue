<template>
  <v-container>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-badge color="red" :content="unreadNotifications.length">
          <v-icon v-on="on" @click="showNotifications">mdi-bell</v-icon>
        </v-badge>
      </template>
      <v-menu v-model="menu" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on }"></template>
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
        <v-divider v-if="notifications.length > 0"></v-divider>
        <div v-else>No notifications found.</div>
      </v-menu>
    </v-tooltip>
  </v-container>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { provideApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '../apollo';
import {jwtDecode } from 'jwt-decode';

export default defineComponent({
  setup() {
    provideApolloClient(apolloClient);
    const store = useStore();
    const menu = ref(false);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const notifications = computed(() => store.state.notifications);
    const unreadNotifications = computed(() => store.getters.unreadNotifications);

    onMounted(() => {
      store.dispatch('fetchNotifications', userId);
      store.dispatch('initSubscription'); 
    });

    const showNotifications = () => {
      menu.value = !menu.value;
    };

    const markNotificationAsSeen = async (notificationId) => {
      await store.dispatch('markNotificationAsSeen', notificationId);
    };

    return {
      notifications,
      unreadNotifications,
      menu,
      showNotifications,
      markNotificationAsSeen,
    };
  },
});
</script>

<style scoped>

</style>
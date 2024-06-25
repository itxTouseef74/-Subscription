<template>
  <v-container>
    <v-list v-if="games.length > 0">
      <v-list-item v-for="game in games" :key="game.id">
        <v-list-item-content>
          <v-list-item-title>{{ game.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ game.genre }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div v-else>
      No games found.
    </div>
  </v-container>
</template>

<script>
import { gql } from 'graphql-tag';
import { ref, onMounted, watch } from 'vue';
import { useQuery, provideApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '../apollo';
import { WebSocketLink } from '@apollo/client/link/ws';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const GET_GAMES_QUERY = gql`
  query GetGames {
    getGames {
      id
      title
      genre
      releaseDate
    }
  }
`;

const NEW_GAME_LAUNCHED = gql`
  subscription {
    newGameLaunched {
      id
      title
      genre
      releaseDate
    }
  }
`;

export default {
  setup() {
    provideApolloClient(apolloClient);

    const { result: gamesResult, loading, error, refetch: refetchGames } = useQuery(GET_GAMES_QUERY);

    const games = ref([]);

    watch(gamesResult, (newVal) => {
      if (newVal && newVal.getGames) {
        games.value = newVal.getGames;
      }
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

    subscriptionClient
      .subscribe({
        query: NEW_GAME_LAUNCHED,
      })
      .subscribe({
        next({ data }) {
          if (data && data.newGameLaunched) {
            games.value.push(data.newGameLaunched);
          }
        },
        error(err) {
          console.error('Subscription error', err);
        },
      });

    onMounted(() => {
      refetchGames();
    });

    return {
      games,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
</style>

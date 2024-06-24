<template>
    <v-container>
      <v-list>
        <v-list-item v-for="game in games" :key="game.id">
          <v-list-item-content>
            <v-list-item-title>{{ game.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ game.genre }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script>
  import { gql } from 'graphql-tag';
  import { useQuery } from '@vue/apollo-composable';
  
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
  
  export default {
    setup() {
      const { result, loading, error } = useQuery(GET_GAMES_QUERY);
      
      return {
        games: result,
        loading,
        error,
      };
    },
  };
  </script>
  
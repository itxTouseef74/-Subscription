<template>
    <v-app>
      <v-app-bar app color="primary">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Game Subscription</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/login">Login</v-btn>
        <v-btn text to="/signup">Signup</v-btn>
        <!-- <v-btn text to="/games">Games</v-btn> -->
        <v-btn text to="/subscription">Subscription</v-btn>
        <v-btn text to="/notifications">Notifications</v-btn>
      </v-app-bar>
  
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'Layout',
    data() {
      return {
        drawer: false,
      };
    },
  };
  </script>
  
  <style>
  
  </style>
  
<template>
    <v-container>
      <v-form @submit.prevent="login">
        <v-text-field label="Email" v-model="email" required></v-text-field>
        <v-text-field label="Password" type="password" v-model="password" required></v-text-field>
        <v-btn type="submit" color="primary">Login</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useMutation, provideApolloClient } from '@vue/apollo-composable';
  import { apolloClient } from '../apollo';
  import { gql } from '@apollo/client/core';
  import { useRouter } from 'vue-router'; 
  
  const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;
  
  export default {
    name: 'Login',
    setup() {
      provideApolloClient(apolloClient);
  
      const router = useRouter(); 
  
      const email = ref('');
      const password = ref('');
      const { mutate, onDone, onError } = useMutation(LOGIN_MUTATION);
  
      const login = async () => {
        try {
          const { data } = await mutate({
            email: email.value,
            password: password.value,
          });
  
          console.log('Login successful', data);
          localStorage.setItem('token', data.login);
  
          // Redirect to notifications route
          router.push({ name: 'notifications' }); 
        } catch (error) {
          console.error('Login failed', error.message);
        }
      };
  
      onDone(({ data }) => {
        console.log('Login successful', data);
        localStorage.setItem('token', data.login);
      });
  
      onError((error) => {
        console.error('Login failed', error.message);
      });
  
      return {
        email,
        password,
        login,
      };
    },
  };
  </script>
  
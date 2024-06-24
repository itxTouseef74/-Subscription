<template>
    <v-container>
      <v-form @submit.prevent="signupUser">
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" color="primary">Signup</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useMutation, provideApolloClient } from '@vue/apollo-composable';
  import { apolloClient } from '../apollo';
  import { gql } from '@apollo/client/core';
  import { useRouter } from 'vue-router';
  
  const SIGNUP_MUTATION = gql`
    mutation Signup($email: String!, $password: String!) {
      signup(email: $email, password: $password)
    }
  `;
  
  export default {
    name: 'Signup',
    setup() {
      provideApolloClient(apolloClient);
  
      const router = useRouter();
      const email = ref('');
      const password = ref('');
  
      const { mutate: signup, onDone, onError } = useMutation(SIGNUP_MUTATION);
  
      const signupUser = async () => {
        try {
          const { data } = await signup({
            email: email.value,
            password: password.value,
          });
  
          console.log('Signup successful', data);
          localStorage.setItem('token', data.signup);
  
          // Redirect to home or another route after signup
          router.push('/');
        } catch (error) {
          console.error('Signup failed', error.message);
        }
      };
  
      onDone(({ data }) => {
        console.log('Signup successful', data);
        localStorage.setItem('token', data.signup);
      });
  
      onError((error) => {
        console.error('Signup failed', error.message);
      });
  
      return {
        email,
        password,
        signupUser,
      };
    },
  };
  </script>
  
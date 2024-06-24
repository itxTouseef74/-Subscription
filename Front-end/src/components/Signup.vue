<template>
    <v-container>
      <v-form @submit.prevent="signup">
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" color="primary">Signup</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import { gql } from 'graphql-tag';
  import { useMutation } from '@vue/apollo-composable';
  
  const SIGNUP_MUTATION = gql`
    mutation Signup($email: String!, $password: String!) {
      signup(email: $email, password: $password)
    }
  `;
  
  export default {
    data: () => ({
      email: '',
      password: '',
    }),
    setup() {
      const { mutate: signup } = useMutation(SIGNUP_MUTATION);
  
      return {
        signup: async (variables) => {
          try {
            const { data } = await signup({ variables });
            localStorage.setItem('token', data.signup);
            this.$router.push('/');
          } catch (error) {
            console.error('Signup failed', error);
          }
        },
      };
    },
  };
  </script>
  
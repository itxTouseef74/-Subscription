<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6">
        <v-tabs v-model="tab">
          <v-tab>Login</v-tab>
          <v-tab>Sign Up</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-form v-model="loginValid" ref="loginForm">
              <v-text-field
                v-model="login.email"
                :rules="[rules.required, rules.email]"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="login.password"
                :rules="[rules.required]"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn color="primary" @click="submitLogin">Login</v-btn>
            </v-form>
          </v-tab-item>
          <v-tab-item>
            <v-form v-model="signupValid" ref="signupForm">
              <v-text-field
                v-model="signup.email"
                :rules="[rules.required, rules.email]"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="signup.password"
                :rules="[rules.required]"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="signup.confirmPassword"
                :rules="[rules.required, passwordMatch]"
                label="Confirm Password"
                type="password"
                required
              ></v-text-field>
              <v-btn color="primary" @click="submitSignup">Sign Up</v-btn>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      tab: 0,
      login: {
        email: '',
        password: ''
      },
      signup: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      loginValid: false,
      signupValid: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
      },
    };
  },
  methods: {
    passwordMatch(value) {
      return value === this.signup.password || 'Passwords must match.';
    },
    submitLogin() {
      if (this.$refs.loginForm.validate()) {
        // Handle login logic here
        alert('Login successful');
      }
    },
    submitSignup() {
      if (this.$refs.signupForm.validate()) {
        // Handle signup logic here
        alert('Signup successful');
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 50px;
}
</style>

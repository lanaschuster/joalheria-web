<template>
  <v-main class="main">
    <v-card>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <form @submit.prevent="login">
          <v-text-field
            outlined
            type="email"
            label="E-mail"
            v-model="credentials.email"
          ></v-text-field>
          <v-text-field
            outlined
            type="password"
            label="Password"
            v-model="credentials.password"
          ></v-text-field>
          <v-btn class="mb-2" type="submit" color="primary" block>Login</v-btn>
          <v-btn outlined @click="login" color="primary" block>I forgot my password</v-btn>
        </form>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Credentials } from '@/models'
import { auth } from '@/store'

export default Vue.extend({
  middleware: 'guest',
  layout: 'login',
  data() {
    return {
      credentials: {} as Credentials
    }
  },
  methods: {
    async login() {
      await auth.login(this.credentials)
    }
  }
})
</script>

<style>
.main {
  padding-left: 80px !important;
  padding-right: 80px !important;
}
</style>
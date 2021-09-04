<template>
  <v-main class="main">
    <v-row>
      <v-col cols="12" sm="12">
        <v-img
          contain
          style="margin: 0 auto;"
          height="300"
          width="300"
          src="/img/logo.png" 
          alt="Logo"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="12">
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
              <div class="d-flex flex-column">
                <v-btn type="submit" color="primary" block class="btn" :loading="loading">Login</v-btn>
                <v-btn outlined @click="login" color="primary" block class="btn">Forgot password?</v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
  computed: {
    loading() {
      return auth.$loading
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

.btn {
  width: 50%;
}
.btn:last-child {
  margin-top: 6px;
}

@media screen and (max-width: 1024px) {
  .main {
    padding-left: 40px !important;
    padding-right: 40px !important;
  }
}

@media screen and (max-width: 425px) {
  .main {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .btn {
    font-size: 24px;
  }
}
</style>
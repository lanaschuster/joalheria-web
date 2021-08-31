<template>
  <v-app>
    <v-main>
      <v-container class="full-width">
        <v-row>
          <v-col 
            class="full-height background d-flex align-center justify-center" 
            cols="12" sm="12" md="4"
          >
            <v-img
              contain
              height="300"
              width="300"
              src="/img/logo.png" 
              alt="Logo"
            ></v-img>
          </v-col>
          <v-col 
            class="full-height d-flex align-center justify-center pl-14 pr-14" 
            cols="12" sm="12" md="8"
          >
            <Nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Snackbar } from '@/components/molecules'

export default Vue.extend({
  middleware: 'guest',
  components: {
    Snackbar
  },
})
</script>

<style lang="scss" scoped>
.full-height {
  height: 100vh;
}
.background {
  background-color: #cb997e;
}
.full-width {
  min-width: 100%;
}
</style>

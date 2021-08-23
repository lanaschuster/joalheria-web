<template>
  <v-app>
    <v-main>
      <v-container class="full-width">
        <v-row>
          <v-col 
            class="full-height background d-flex align-center justify-center" 
            cols="12" sm="12" md="4"
          >
            <h1 class="white--text">Jewellery Web Admin</h1>
          </v-col>
          <v-col 
            class="full-height d-flex align-center justify-center" 
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

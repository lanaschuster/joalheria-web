<template>
  <v-app>
    <v-main>
      <v-container class="full-width">
        <v-row>
          <v-col
            class="hidden-sm-and-down full-height background"
            cols="12"
            sm="12"
            md="4"
          >
            <div class="d-flex flex-column justify-center align-center">
              <v-img
                contain
                height="800"
                width="500"
                src="/img/image857.png"
                alt="Logo"
              ></v-img>
              <span class="white--text description">
                Jewellery Management made simple <strong>.</strong>
              </span>
            </div>
          </v-col>
          <v-col
            class="full-height d-flex align-center justify-center pl-14 pr-14"
            cols="12"
            sm="12"
            md="8"
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
    Snackbar,
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
.description {
  font-size: 30px;
  font-weight: normal;
  font-family: 'Satisfy', cursive;
  text-align: center;
  margin-bottom: 60px;
}

@media screen and (max-width: 1024px) {
  .description {
    font-size: 18px;
  }
}
</style>

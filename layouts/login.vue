<template>
  <v-app>
    <v-main>
      <v-container class="full-width my-container">
        <section class="background full-height d-flex align-center justify-center">
        </section>
        <section class="form full-height d-flex align-center justify-center">
          <Nuxt />
        </section>
      </v-container>
    </v-main>
    <Snackbar />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Snackbar } from '@/components/molecules'
import Permissions from '~/pages/dashboard/permissions.vue'

export default Vue.extend({
  middleware: 'guest',
  components: {
    Snackbar,
    Permissions,
  }
})
</script>

<style lang="scss" scoped>
.my-container {
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 3fr;
}
.full-height {
  height: 100vh;
}
.background {
  background-color: #cb997e;
  border-radius: 0 30px 30px 0;
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
@media screen and (min-width: 1025px) {
  .form {
    padding: 0 16rem;
  }
}
@media screen and (min-width: 1024px) {
  .form {
    padding: 0 2rem;
  }
}
@media screen and (max-width: 1024px) {
  .description {
    font-size: 18px;
  }
  .background {
    display: none !important;
  }
  .my-container {
    grid-template-columns: 1fr;
  }
}
</style>
